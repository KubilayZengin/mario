import styled from 'styled-components';
import AioLogo from './AioLogo'; // Your custom AI Operator logo

const HeaderContainer = styled.header`
  display: flex;
  justify-content: flex-end; /* Aligns the logo to the right */
  align-items: center;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  height: 84px; /* Gives the header a consistent height */
`;

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  height: 40px; /* Control the AI Operator logo size here */
  flex-shrink: 0;
`;

// The header no longer needs any props
function Header() {
  return (
    <HeaderContainer>
      <LogoLink href="https://www.aioperator.com/" target="_blank" rel="noopener noreferrer">
        <AioLogo />
      </LogoLink>
    </HeaderContainer>
  );
}

export default Header;
