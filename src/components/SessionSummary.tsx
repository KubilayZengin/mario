import styled from 'styled-components';
import { colors } from '../style/theme';

const Container = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 32px auto;
  text-align: left;
`;

const Text = styled.p`
  white-space: pre-wrap;
  color: ${colors.content.primary};
`;

const SessionSummary = ({ output }: { output: string }) => {
  if (!output) return null;
  return (
    <Container>
      <h2>Session Summary</h2>
      <Text>{output}</Text>
    </Container>
  );
};

export default SessionSummary;
