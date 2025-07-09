import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Quiz, { QuizItem } from './components/Quiz';
import SessionSummary from './components/SessionSummary';
import VideoTimestamps, { Timestamp } from './components/VideoTimestamps';
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
  max-width: 720px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

function App() {
  const unsafeWindow: any = window;
  const { quiz, output, timestamps }: {
    quiz: QuizItem[];
    output: string;
    timestamps: Timestamp[];
  } = unsafeWindow?.vars ?? {};

  return (
    <AnimatePresence>
        <Container
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
            <Header />
            <Content>
              <Quiz quiz={quiz} />
              <SessionSummary output={output} />
              <VideoTimestamps timestamps={timestamps} />
            </Content>
            <Footer />
          </Container>
      </AnimatePresence>
  );
}

export default App;
