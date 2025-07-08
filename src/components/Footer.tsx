import { styled } from 'styled-components';
import { colors } from '../style/theme';
import AioLogo from './AioLogo'; // Import your custom logo component

const Row = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 128px;
  font-size: 14px;
  line-height: 1.5;
  color: ${colors.content.secondary};
  padding: 20px;

  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    /* The logo size you requested */
    height: 72px;
    margin-bottom: 18px;
    user-select: none;
  }

  a {
    color: ${colors.content.secondary};
    text-decoration: underline;

    &:hover {
      color: ${colors.content.secondary};
      text-decoration: none;
    }
  }
`;

const Footer = () => {
  return (
    <Row>
      <AioLogo />
      <div>
        Powered by{' '}
        <a
          href="https://aioperator.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          AI Operator
        </a>
      </div>
    </Row>
  );
};

export default Footer;
