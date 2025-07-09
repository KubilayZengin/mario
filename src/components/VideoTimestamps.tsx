import styled from 'styled-components';
import { colors } from '../style/theme';

export interface Timestamp {
  time: string;
  note: string;
}

const Container = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 32px auto;
  text-align: left;
`;

const Row = styled.div`
  margin-bottom: 8px;
`;

const Time = styled.span`
  font-weight: bold;
  margin-right: 8px;
`;

const Note = styled.span`
  color: ${colors.content.secondary};
`;

const VideoTimestamps = ({ timestamps }: { timestamps: Timestamp[] }) => {
  if (!timestamps || timestamps.length === 0) return null;
  return (
    <Container>
      <h2>Video Timestamps</h2>
      {timestamps.map((ts, idx) => (
        <Row key={idx}>
          <Time>{ts.time}</Time>
          <Note>{ts.note}</Note>
        </Row>
      ))}
    </Container>
  );
};

export default VideoTimestamps;
