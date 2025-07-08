import { useMemo } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import Report from './components/Report';
import TableOfContents from './components/TableOfContents';
import Intro from './components/Intro';
import Sources, { Source } from './components/Sources';
import MetadataRibbon from './components/MetadataRibbon';
import Footer from './components/Footer';
import Podcast from './components/Podcast';
import { preprocessHtml } from './helpers/processHtml';
import { AnimatePresence, motion } from 'framer-motion';
import { colors } from './style/theme';

const Container = styled(motion.div)`
  background-color: ${colors.surface.background};
  color: ${colors.content.primary};
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0 auto;

  font-size: 14px;
  line-height: 1.3;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 72px;

  @media (max-width: 700px) {
    padding: 20px;
    flex-direction: column;
    justify-content: flex-start;
  }

  @media print {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
`;

const TocPane = styled.div`
  width: 300px;
  max-width: 300px;
  min-width: 300px;

  position: sticky;
  top: 32px;
  display: flex;
  align-self: flex-start;
  max-height: calc(100svh - 32px); /* visible viewport area */
  overflow: hidden; /* hide overflow from outer container */

  @media (max-width: 700px) {
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    top: unset;
    position: relative;
    max-height: unset;
  }

  @media print {
    display: none;
  }
`;

const ReportPane = styled.div`
  width: 100%;
  max-width: 720px;

  @media (max-width: 700px) {
    max-width: 100%;
  }
`;

function App() {
  const unsafeWindow: any = window;
  const {
    metadata,
    htmlReport,
    charts,
    sources,

    podcastUrl,
    podcastCoverImage,
    podcastTitle,
    podcastDescription,
    podcastEpisodeTitle,
    podcastEpisodeDescription,
  }: {
    htmlReport: string;
    charts: any;
    metadata: {
      categoryName: string;
      dateCreated: string;
      title: string;
      description: string;
      summary: string[];
    };
    sources: Source[];
    podcastUrl?: string;
    podcastCoverImage?: string;
    podcastTitle: string;
    podcastDescription: string;
    podcastEpisodeTitle: string;
    podcastEpisodeDescription: string;
  } = unsafeWindow?.vars ?? {};

  const { html, toc } = useMemo(
    () => preprocessHtml(htmlReport, charts, sources),
    [htmlReport, charts, sources],
  );

  let resolvedToc = toc;
  if (podcastUrl) {
    resolvedToc = [
      {
        id: 'podcast',
        text: 'Podcast',
      },
      ...toc,
    ];
  }

  resolvedToc = [
    {
      id: 'takeaway',
      text: 'The Takeaway',
    },
    ...resolvedToc,
    {
      id: 'sources',
      text: 'Sources',
    },
  ];

  return (
    <AnimatePresence>
        <Container
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a id="top" />
          {/* The Header no longer takes a title */}
          <Header />

          {/* The Intro now takes the title and description */}
          <Intro
            title={metadata.title}
            description={metadata.description}
            summary={metadata.summary}
          />

          <Content>
            <TocPane>
              <TableOfContents toc={resolvedToc} title={metadata.title} />
            </TocPane>
            <ReportPane>
              <MetadataRibbon
                dateCreated={metadata.dateCreated}
                html={htmlReport}
              />
              {podcastUrl && podcastCoverImage && (
                <Podcast
                  audioUrl={podcastUrl}
                  imageUrl={podcastCoverImage}
                  metadata={{
                    podcastTitle,
                    podcastDescription,
                    episodeTitle: podcastEpisodeTitle,
                    episodeDescription: podcastEpisodeDescription
                  }}
                />
              )}
              <Report html={html} charts={charts} />
            </ReportPane>
          </Content>

          <Sources sources={sources} />
          <Footer />
        </Container>
    </AnimatePresence>
  );
}

export default App;
