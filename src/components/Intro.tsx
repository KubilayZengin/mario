import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from '../style/theme';

// This container now holds the logo, title, and summary
const Container = styled(motion.div)`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  margin-top: 48px;
  margin-bottom: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 48px;
  padding: 20px;

  @media (max-width: 700px) {
    gap: 32px;
    margin-top: 32px;
    margin-bottom: 32px;
  }
`;

const PartnerLogosWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
  width: 100%;
  text-align: center;
  margin-bottom: 16px;
`;

// --- UPDATED: Styles for each logo have been adjusted ---
const NpuLogo = styled.img`
  height: 90px; /* Increased by 1.25x from 72px */
  width: auto;
  max-width: 280px;
`;

const MetaLogo = styled.img`
  height: 64px; /* Kept the original height for balance */
  width: auto;
  max-width: 200px;
`;
// --- END UPDATED ---


// Styles for the main title and description
const Title = styled(motion.h1)`
  font-size: 52px;
  line-height: 1.1;
  font-weight: 700;
  text-align: center;
  color: ${colors.content.primary};

  @media (max-width: 700px) {
    font-size: 40px;
  }
`;

const Description = styled(motion.p)`
  font-size: 16px;
  color: ${colors.content.secondary};
  text-align: center;
  margin-top: -24px;
`;


// Unchanged styles for the summary box
const Summary = styled(motion.div)`
  background-color: ${colors.surface.layer};
  color: ${colors.content.primary};
  border-radius: 20px;
  padding: 20px 22px;
  padding-left: 1.5rem;
  text-align: left;
  font-size: 15px;
  line-height: 1.5;
  position: relative;
  width: 100%;
  max-width: 620px;

  ol {
    list-style: none;
    counter-reset: item;
    padding: 0;
    margin: 0;
    margin-top: -18px;

    li {
      counter-increment: item;
      position: relative;
      padding-left: 96px;
      margin-block: 32px;

      &::before {
        content: '#' counter(item);
        position: absolute;
        left: 0;
        top: 0;
        width: 76px;
        text-align: center;
        font-size: 42px;
        font-weight: 700;
        color: ${colors.content.secondary};
        opacity: 0.4;
        line-height: 1;
      }
    }
  }
`;

const SummaryHeader = styled.div`
  user-select: none;
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${colors.content.secondary};
`;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const Intro = ({
  title,
  description,
  summary,
}: {
  title: string;
  description: string;
  summary: string[];
}) => {
  return (
    <Container variants={containerVariants} initial="hidden" animate="show">
      <PartnerLogosWrapper variants={childVariants}>
        <a href="https://nonplusultra.eu/" target="_blank" rel="noopener noreferrer">
          <NpuLogo
            src="https://i.imgur.com/YoI8g49.png"
            alt="Nonplusultra Logo"
          />
        </a>
        <a href="https://www.meta.com/" target="_blank" rel="noopener noreferrer">
          <MetaLogo
            src="https://pngimg.com/uploads/meta/meta_PNG5.png"
            alt="Meta Logo"
          />
        </a>
      </PartnerLogosWrapper>

      <Title variants={childVariants}>{title}</Title>
      
      <Description variants={childVariants}>{description}</Description>

      <Summary variants={childVariants}>
        <SummaryHeader>{`Today's Top Ten`}</SummaryHeader>
        <ol>
          {summary.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </Summary>
    </Container>
  );
};

export default Intro;
