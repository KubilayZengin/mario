import { Source } from "../components/Sources";

const optimizeImage = (imageUrl: string, width?: number): string => {
  try {
    let resolvedUrl = imageUrl;

    const url = new URL(imageUrl);
    if (url.hostname === 'images.mindstudio-cdn.com') {
      resolvedUrl = `${url.origin}${url.pathname}?fm=auto`;
    }

    if (width) {
      resolvedUrl += `&w=${width * 3}`;
    }

    return resolvedUrl;
  } catch {
    //
  }
  return imageUrl;
}


export type TocEntry = {
  id: string;
  text: string;
  children?: TocEntry[];
};

export const preprocessHtml = (html: string, charts: any[], sources: Source[]): { html: string; toc: TocEntry[] } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const toc: TocEntry[] = [];

  // Fix links to open in a new tab
  doc.querySelectorAll('a').forEach((a) => {
    if (!a.hasAttribute('target')) {
      a.setAttribute('target', '_blank');
    }
  });

  // Optimize images
  const seenImgSrcs = new Set<string>();
  doc.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');

    const isInFigure = img.parentElement?.tagName === 'FIGURE';
    if (!isInFigure) {
      img.remove();
      return;
    }

    if (!src || seenImgSrcs.has(src)) {
      img.parentElement?.remove();
      return;
    }

    seenImgSrcs.add(src);

    const isInAside = img.parentElement?.parentElement?.tagName === 'ASIDE';
    img.setAttribute('src', optimizeImage(src, isInAside ? 300 : undefined));

    img.setAttribute(
      'onerror',
      "this.parentElement && (this.parentElement.style.display = 'none')"
    );
  });

  // Remove duplicate IDs
  const seenIds = new Set<string>();
  doc.querySelectorAll<HTMLElement>('[id]').forEach((el) => {
    const id = el.getAttribute('id');
    if (!id) return;

    if (seenIds.has(id)) {
      el.parentElement?.remove();
    } else {
      seenIds.add(id);
    }
  });

  // Generate ToC from h2 and h3
  doc.querySelectorAll('h2, h3').forEach((heading) => {
    const text = heading.textContent?.trim() || '';
    const id = text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

    heading.setAttribute('id', id);

    if (heading.tagName === 'H2') {
      toc.push({
        id,
        text,
        children: [],
      });
    } else {
      try {
        toc[toc.length - 1].children!.push({
          id,
          text,
        });
      } catch {
        // fallback silently
      }
    }
  });

  // Add captions to any charts that are missing them.
  doc.querySelectorAll('canvas').forEach((el) => {
    try {
      const id = el.getAttribute('id');
      if (!id) return;

      const matchingChart = charts.find((chart) => chart.id === id);
      if (!matchingChart) {
        el.remove();
        return;
      }

      if (el.nextElementSibling?.tagName !== 'FIGCAPTION') {
        const { name } = matchingChart;
        const caption = document.createElement('figcaption');
        caption.innerText = name;
        el.parentElement?.appendChild(caption);
      }
    } catch (err) {
      //
    }
  });

  // Add eyebrows to section descriptions
  doc.querySelectorAll('.section-description').forEach((el) => {
    el.innerHTML = `<div class="eyebrow">Key Points</div><p>${el.innerHTML}</p>`;
  });

  // Get the processed HTML as a string
  let finalHtml = doc.body.innerHTML;

  // --- FINAL VERSION ---
  // This logic now finds the citation, gets the corresponding source URL,
  // and creates a link that opens that URL in a new tab.
  finalHtml = finalHtml.replace(/\[\^(\d+)\]/g, (match, sourceNumberStr) => {
    const sourceNumber = parseInt(sourceNumberStr, 10);
    // The sources array is 0-indexed, so we subtract 1
    const sourceIndex = sourceNumber - 1;

    // Check if the source number is valid and exists in our sources array
    if (sourceIndex >= 0 && sourceIndex < sources.length) {
      const sourceUrl = sources[sourceIndex].url;
      // Create a link that opens the actual source URL in a new tab
      return `&nbsp;<a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" class="source-link">[${sourceNumber}]</a>`;
    }
    
    // If the citation is invalid, remove it from the text
    return '';
  });

  return {
    html: finalHtml,
    toc,
  };
};
