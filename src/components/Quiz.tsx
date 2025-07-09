import styled from 'styled-components';
import { colors } from '../style/theme';

export interface QuizItem {
  question: string;
  answer: string;
}

const Container = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 32px auto;
  text-align: left;
`;

const Question = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
`;

const Answer = styled.div`
  margin-bottom: 12px;
  color: ${colors.content.secondary};
`;

const Quiz = ({ quiz }: { quiz: QuizItem[] }) => {
  if (!quiz || quiz.length === 0) return null;
  return (
    <Container>
      <h2>Quiz</h2>
      {quiz.map((item, idx) => (
        <div key={idx}>
          <Question>{item.question}</Question>
          <Answer>{item.answer}</Answer>
        </div>
      ))}
    </Container>
  );
};

export default Quiz;
