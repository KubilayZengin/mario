import React, { useEffect, useMemo, useRef } from 'react';
import Chart from 'chart.js/auto';
import styled from 'styled-components';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  formatChart,
  formatSingleValueMetric,
} from '../helpers/formatChart';
import { colors } from '../style/theme';
import { DownloadIcon, OpenExternalIcon } from './ActionIcons';
import { renderToStaticMarkup } from 'react-dom/server';

Chart.register(ChartDataLabels);

// Report area will contain plain HTML tags, so needs to include styling for
// all of them to look nice
const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  text-align: left;
  color: ${colors.content.primary};
  font-size: 17px;
  line-height: 1.6;
  text-wrap: pretty;

  /* --- Element Styles --- */
  section {
    position: relative;
    + {
      &::before {
        content: '';
        display: block;
        height: 1px;
        background-color: ${colors.stroke.subtle};
        opacity: 0.2;
        margin-block: 64px;
        width: 80%;
        margin-inline: auto;
      }
    }
  }

  h2 {
    margin: 0;
    padding: 0;
    font-size: 26px;
    font-weight: 700;
    line-height: 1.2;
    color: ${colors.content.secondary};
    scroll-margin-top: 64px;
  }

  h3 {
    margin: 0;
    padding: 0;
    font-size: 22px;
    font-weight: 600;
    line-height: 1.3;
    color: ${colors.content.secondary};
    opacity: 0.7;
    scroll-margin-top: 24px;
  }

  p {
    font-size: 17px;
    line-height: 1.6;
  }

  .section-description {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: ${colors.surface.layer};
    padding: 20px 22px;
    border-radius: 20px;

    .eyebrow {
      font-size: 15px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      color: ${colors.content.secondary};
    }

    p {
      font-size: 15px;
      line-height: 1.6;
      margin: 0;
    }
  }

  .section-content {
    width: 100%;
    display: flow-root;
  }

  aside {
    display: flex;
    align-items: flex-start;
    clear: both;

    &.left {
      float: left;
      margin-right: 36px;
    }

    &.right {
      float: right;
      margin-left: 36px;
    }

    .pull-quote {
      width: 300px;
      min-width: 300px;
      max-width: 300px;
      margin: 0 auto;
    }

    figure {
      width: unset;
      display: flex;
      align-items: center;
      justify-content: center;

      canvas {
        width: 300px;
        min-width: 300px;
        max-width: 300px;
        height: 300px;
        min-height: 300px;
        max-height: 300px;
        aspect-ratio: 1 / 1;
      }

      img {
        max-width: 360px;
        max-height: 360px;
      }
    }
  }

  a {
    color: ${colors.content.accent};
    text-decoration: underline;

    &:hover {
      color: ${colors.content.accent};
      text-decoration: none;
    }

    &:visited {
      color: ${colors.content.accent};
    }

    &:active {
      color: ${colors.content.accent};
    }
  }

  .pull-quote {
    width: 80%;
    background-color: ${colors.surface.layer};
    border-radius: 20px;
    padding: 24px;
    margin: 24px auto;
    position: relative;
    overflow: hidden;

    p {
      font-family: 'Lora', serif;
      margin: 0;
      font-size: 18px;
      line-height: 1.4;
      position: relative;
      z-index: 1;
    }

    &::before {
      content: '”';
      position: absolute;
      top: 8px;
      right: 12px;
      font-size: 120px;
      line-height: 1;
      font-family: 'Georgia', serif;
      color: rgba(255, 255, 255, 0.3);
      z-index: 0;
      pointer-events: none;
    }
  }

  figure {
    margin: 0 auto;
    padding: 0;
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${colors.surface.layer};
    border-radius: 20px;
    position: relative;

    canvas {
      width: 100%;
      aspect-ratio: 16 / 9;
    }

    img {
      width: 100%;
      border-radius: 20px;
      overflow: hidden;

      max-height: 700px;
      object-fit: cover;
      object-position: top;
    }

    &:has(img) {
      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 20px;
        border: 1px solid rgba(0, 0, 0, 0.075);
        pointer-events: none; /* Allows hover on elements below */
      }
    }

    .stat {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 8px;
      padding: 32px 30px;
      max-width: 300px;

      .stat-value {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-weight: 700;
        font-size: 54px;
        line-height: 1;
        color: ${colors.content.primary};

        &.small {
          font-size: 32px;
        }
      }

      .stat-label {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        max-width: 180px;
        line-height: 1.5;
        color: ${colors.content.secondary};
      }
    }

    figcaption {
      position: absolute;
      top: 100%;
      font-size: 12px;
      line-height: 1.3;
      color: ${colors.content.secondary};
      margin-top: 12px;
      text-align: center;
      height: 32px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &:has(.stat) {
      figcaption {
        display: none;
      }
      margin-block-end: 24px !important;
    }
  }

  strong {
    font-weight: 700;
  }

  em {
    font-style: italic;
  }

  span.highlight {
    background-color: rgba(255,255,255,0.15);
    padding: 1px 0px;
  }

  ol {
    list-style-position: inside;
    font-size: 17px;
    line-height: 1.6;
    padding-left: 1.5rem;
    counter-reset: item;
  }

  ul {
    font-size: 17px;
    line-height: 1.6;
    padding-left: 1.5rem;
    list-style-type: disc;

    ul {
      list-style-type: circle;
    }
  }

  li {
    font-size: 17px;
    line-height: 1.6;
  }

  table {
    width: 90%;
    margin: 0 auto;
    border-collapse: collapse;
    font-size: 15px;
    line-height: 1.4;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    overflow: hidden;

    th {
      background-color: ${colors.surface.layer};
      padding: 12px 20px;
      text-align: left;
      font-weight: 600;
    }

    tr {
      background-color: ${colors.surface.background};
      &:nth-child(even) {
        background-color: ${colors.surface.layer};
      }

      &:hover {
        background-color: ${colors.surface.layerStrong};
      }
    }

    td {
      padding: 12px 20px;
      border-bottom: 1px solid ${colors.stroke.subtle};
      vertical-align: top;
    }

    caption {
      margin-bottom: 12.8px;
      font-style: italic;
      color: ${colors.content.secondary};
      text-align: left;
      font-size: 17px;
    }
  }

  code {
    font-family: 'Consolas', 'Monaco', monospace;
    background-color: ${colors.surface.layer};
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-size: 17px;
  }

  pre {
    background-color: ${colors.surface.layer};
    padding: 1.2rem;
    border-radius: 6px;
    overflow-x: auto;
    line-height: 1.4;

    code {
      background-color: transparent;
      padding: 0;
      font-size: 17px;
      display: block;
    }
  }

  /** Citations */
  .inline-citation {
    position: relative;
    display: inline-block;

    sup {
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
      transform: translateY(-2px);
      margin-left: -3px;
      display: inline-block;

      a {
        text-decoration: none;
        color: ${colors.content.secondary};

        &:hover {
          color: ${colors.content.secondary};
        }
      }
    }

    .source-hover {
      display: none;
      position: absolute;
      bottom: calc(100% - 6px);
      left: -350px;
      width: 380px;
      padding-bottom: 14px;
    }

    .source-card {
      background-color: ${colors.surface.layer};
      border: 1px solid ${colors.stroke.subtle};
      color: ${colors.content.secondary};
      padding: 16px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.6;

      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      .source-header {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 6px;
      }

      .source-publisher {
        width: 100%;
        display: flex;
        align-items: flex-start;

        font-size: 11px;
        line-height: 1.3;
        text-transform: uppercase;
      }

      .source-date {
        margin-left: auto;
        display: flex;
        align-items: center;
        line-height: 1.3;
        white-space: nowrap;

        font-size: 11px;
        line-height: 1.3;
        text-transform: capitalize;
      }

      .source-title {
        width: 100%;
        display: flex;
        align-items: center;

        font-weight: 600;
        line-height: 1.3;
        margin-bottom: 4px;

        color: ${colors.content.primary};

        &:hover {
          color: ${colors.content.primary};
        }

        &:visited {
          color: ${colors.content.primary};
        }

        &:active {
          color: ${colors.content.primary};
        }
      }

      .source-description {
        width: 100%;
        display: flex;
        align-items: center;
        line-height: 1.3;

        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .source-type {
        margin-top: 6px;
        display: flex;
        align-items: flex-start;
        text-transform: capitalize;
        white-space: nowrap;
        width: min-content;

        font-size: 11px;
        line-height: 1.3;

        background: ${colors.surface.layerStrong};
        color: ${colors.content.secondary};
        border-radius: 4px;
        padding: 2px 6px;
        line-height: 1.3;
      }
    }

    &:hover {
      .source-hover {
        display: block;
      }
    }
  }

  /* --- Spacing: Centralized margin-block definitions --- */
  section {
    margin-block-end: 64px;
  }

  h2 {
    margin-block-end: 24px;
  }

  h3 {
    margin-block: 32px 12px;
  }

  p {
    margin-block: 16px;
  }

  ol,
  ul {
    margin-block: 12px;

    ol,
    ul {
      margin-block: 8px;
    }
  }

  li {
    margin-block: 8px;
  }

  table {
    margin-block: 32px;
  }

  pre {
    margin-block: 24px;
  }

  figure {
    margin: 0px auto 65px;
    margin-block-start: 24px;
  }

  /** End Mark */
  section {
    &:last-of-type {
      > :last-child {
        > :last-child {
          &::after {
            content: '◼';
            display: inline-block;
            transform: translateY(1px) translateX(1px);
            font-size: 17px;
            color: ${colors.content.secondary};
            user-select: none;
          }
        }
      }
    }
  }

  /** Mobile */
  @media (max-width: 700px) {
    aside {
      width: 100%;
      margin-left: 0 !important;
      margin-right: 0 !important;

      .pull-quote {
        width: 100%;
        min-width: 100%;
        max-width: 100%;
        margin-block-end: 18px;
      }

      figure {
        width: 100%;
        canvas {
          width: 100%;
          min-width: 100%;
          max-width: 100%;
        }

        img {
          width: 100%;
          min-width: 100%;
          max-width: 100%;
        }
      }
    }

    figure {
      width: 100%;
    }
  }


  /** Print */
  @media print {
    section {
      margin-block: 0;
    }
  }

  /* --- Styles for Image Actions --- */
  .image-action-wrapper {
    position: relative;
    display: block;
    line-height: 0;
  }

  .image-actions-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    border-radius: 20px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    pointer-events: none;
  }

  .image-action-wrapper:hover .image-actions-overlay {
    opacity: 1;
    pointer-events: auto;
  }

  .image-action-button {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 12px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      text-decoration: none;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const Report = ({
  html,
  charts,
}: {
  html: string;
  charts: {
    id: string;
    name: string;
    config: any;
    description: string;
  }[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartInstances = useRef<Record<string, Chart>>({});

  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup old charts
    Object.values(chartInstances.current).forEach((chart) => chart.destroy());
    chartInstances.current = {};

    charts.forEach(({ id, name, config }) => {
      const canvas = containerRef.current!.querySelector<HTMLCanvasElement>(
        `#${id}`,
      );
      if (!canvas) return;

      const resolvedConfig = formatChart(config);

      try {
        if (
          resolvedConfig.data.datasets.length === 1 &&
          resolvedConfig.data.datasets[0].data.length === 1
        ) {
          const statCard = formatSingleValueMetric(name, resolvedConfig);
          canvas.replaceWith(...statCard);
          return;
        }
      } catch (err) {
        console.log(err);
      }

      chartInstances.current[id] = new Chart(canvas, resolvedConfig);
    });

    // --- FINAL LOGIC for Image Actions ---
    const figures = containerRef.current.querySelectorAll('figure');
    figures.forEach(figure => {
      const img = figure.querySelector('img');
      // Check if we haven't already added the actions to this image
      if (img && !figure.querySelector('.image-action-wrapper')) {
        const src = img.src;

        const wrapper = document.createElement('div');
        wrapper.className = 'image-action-wrapper';

        const overlay = document.createElement('div');
        overlay.className = 'image-actions-overlay';

        // --- Download Button with robust logic ---
        const downloadButton = document.createElement('button');
        downloadButton.className = 'image-action-button';
        downloadButton.title = 'Download Image';
        downloadButton.innerHTML = renderToStaticMarkup(<DownloadIcon />);
        downloadButton.onclick = async (e) => {
          e.preventDefault();
          e.stopPropagation();
          try {
            // Fetch the image data
            const response = await fetch(src);
            const blob = await response.blob();
            // Create a temporary URL for the data
            const url = window.URL.createObjectURL(blob);
            // Create a temporary link to trigger the download
            const link = document.createElement('a');
            link.href = url;
            const filename = src.substring(src.lastIndexOf('/') + 1).split('?')[0] || 'image.png';
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            // Clean up the temporary link and URL
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error('Download failed:', error);
            // If download fails, fall back to opening in a new tab
            window.open(src, '_blank');
          }
        };

        // --- Open Button (Unchanged from your code) ---
        const openLink = document.createElement('a');
        openLink.href = src;
        openLink.target = '_blank';
        openLink.rel = 'noopener noreferrer';
        openLink.className = 'image-action-button';
        openLink.title = 'Open Image in New Tab';
        openLink.innerHTML = renderToStaticMarkup(<OpenExternalIcon />);
        
        overlay.appendChild(downloadButton);
        overlay.appendChild(openLink);

        // This carefully wraps the image without breaking the layout
        img.parentNode?.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        wrapper.appendChild(overlay);
      }
    });

    return () => {
      Object.values(chartInstances.current).forEach((chart) => chart.destroy());
      chartInstances.current = {};
    };
  }, [html, charts]);

  return useMemo(
    () => (
      <Container
        ref={containerRef}
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    ),
    [html],
  );
};

export default Report;
