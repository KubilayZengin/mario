import styled, { keyframes } from 'styled-components';
import { Palette } from '@vibrant/color';
import Player from './components/Player';
import { colors } from '../../style/theme';

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 24px;

  scroll-margin-top: 64px;
`;

const Summary = styled.div`
  width: 100%;
  background-color: #f6f6f7;
  border-radius: 20px;
  padding: 22px;
  text-align: left;
  font-size: 15px;
  line-height: 1.5;
  position: relative;

  background-color: ${colors.surface.layer};
  color: ${colors.content.primary};

  box-shadow: 0px 27px 8px 0px rgba(0, 0, 0, 0),
    0px 17px 7px 0px rgba(0, 0, 0, 0.01), 0px 10px 6px 0px rgba(0, 0, 0, 0.05),
    0px 4px 4px 0px rgba(0, 0, 0, 0.09), 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
`;

export interface PodcastMetadata {
  episodeTitle: string;
  episodeDescription: string;
  podcastTitle: string;
  podcastDescription: string;
}

const Podcast = ({
  audioUrl,
  imageUrl,
  metadata,
}: {
  audioUrl: string;
  imageUrl: string;
  metadata: PodcastMetadata;
}) => {
  return (
    <Container id="podcast">
      <Summary>
        <Player
          audio={audioUrl}
          imageUrl={imageUrl}
          metadata={metadata}
        />
      </Summary>
    </Container>
  );
};

export default Podcast;
