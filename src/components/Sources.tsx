import styled from 'styled-components';
import { Palette } from '@vibrant/color';
import { getShade } from '../helpers/formatChart';
import { colors } from '../style/theme';

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 64px auto 128px;
  padding: 0 32px;

  scroll-margin-top: 12px;

  @media (max-width: 700px) {
    padding: 0 20px;
  }
`;

const Heading = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
`;

const Masonry = styled.div`
  column-count: 1;
  column-gap: 24px;

  @media (min-width: 600px) {
    column-count: 2;
  }

  @media (min-width: 900px) {
    column-count: 3;
  }

  @media (min-width: 1200px) {
    column-count: 4;
  }

  @media (max-width: 700px) {
    column-gap: 20px;
  }
`;

const SourceItem = styled.div`
  break-inside: avoid;
  margin-bottom: 24px;
  background-color: ${colors.surface.layer};
  color: ${colors.content.secondary};
  padding: 20px 24px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.6;
  display: flex;
  flex-direction: column;

  width: 100%;
  text-align: left;
`;

const Snippet = styled.div`
  font-style: italic;
  width: 100%;
  text-align: left;

  padding-bottom: 12px;
  border-bottom: 1px solid ${colors.stroke.subtle};
  margin-bottom: 16px;
  word-break: break-all;
`;

const Publisher = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;

  font-size: 11px;
  line-height: 1.3;
  margin-bottom: 4px;
  text-transform: uppercase;
`;

const PublisherRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const SourceIndex = styled.div`
  margin-left: auto;
  font-size: 11px;
  color: ${colors.content.secondary};
`;

const PublisherType = styled.div`
  user-select: none;
  display: flex;
  align-items: flex-start;
  text-transform: capitalize;
  white-space: nowrap;
  width: min-content;

  font-size: 11px;
  line-height: 1.3;

  border-radius: 4px;
  padding: 2px 6px;
  line-height: 1.3;
  background: ${colors.surface.layerStrong};
  color: ${colors.content.secondary};
`;

const SourceTitle = styled.a`
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
`;

const Description = styled.div`
  line-height: 1.3;
`;

const DatePublished = styled.div`
  margin-top: 8px;
  font-size: 11px;
  line-height: 1.3;
  margin-bottom: 4px;
  text-transform: uppercase;
`;

export interface Source {
  url: string;
  snippets: string[];
  siteInfo: {
    title: string;
    description: string;
    publisher: string;
    type: string;
    datePublished: string|null;
  };
}

const Sources = ({
  sources,
}: {
  sources: Source[];
}) => {
  const flatSources = sources.flatMap((source, i) =>
    source.snippets.map((snippet) => ({
      url: source.url,
      snippet,
      siteInfo: source.siteInfo,
      rootIndex: i,
    })),
  );

  return (
    <Container id="sources">
      <Heading>Sources</Heading>
      <Masonry>
        {flatSources
          .filter(({ snippet }) => snippet)
          .map(({ url, snippet, siteInfo = {}, rootIndex}, idx) => (
            // --- THIS IS THE ONLY CHANGE ---
            // I've added the id attribute here, using the rootIndex to match the links.
            <SourceItem key={idx} id={`source-${rootIndex + 1}`}>
              <PublisherRow>
                <PublisherType>
                  {siteInfo.type ?? 'Source'}
                </PublisherType>
                <SourceIndex title="The index of the root source used for inline citations.">
                 [{rootIndex + 1}]
                </SourceIndex>
              </PublisherRow>
              <Snippet>{`"${snippet}"`}</Snippet>
              {siteInfo.publisher && (
                <Publisher>{siteInfo.publisher}</Publisher>
              )}
              <SourceTitle
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {siteInfo?.title}
              </SourceTitle>
              {siteInfo.description && (
                <Description>{siteInfo.description}</Description>
              )}
              {siteInfo.datePublished && (
                <DatePublished>{siteInfo.datePublished}</DatePublished>
              )}
            </SourceItem>
          ))}
      </Masonry>
    </Container>
  );
};

export default Sources;
