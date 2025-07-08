import { useRef } from 'react';

import styled, { keyframes } from 'styled-components';

const Wrapper = styled.div`

`;

const RotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
const DashAnimation = keyframes`
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
`;

const Container = styled.div<{
  size?: number;
  $overrideColor?: string;
  delay: string;
}>`
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;

  ${({ size }) =>
    size &&
    `
    width: ${size}px;
    height: ${size}px;
  `}

  color: ${({ $overrideColor }) => $overrideColor};

  will-change: transform;

  svg {
    width: 100% !important;
    height: 100% !important;
    animation: ${RotateAnimation} 2s linear infinite;
    animation-delay: ${({ delay }) => delay};
    transform-origin: center;

    circle {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
      stroke: currentColor;
      transform-origin: center;
      animation: ${DashAnimation} 2s ease-in-out infinite;
      animation-delay: ${({ delay }) => delay};
    }
  }

  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;

  pointer-events: none;
`;

const LoadingOverlay = () => {
  const animationDuration = 2000;
  const now = performance.now();
  const delay = useRef((now % animationDuration) / animationDuration);

  return (
    <Wrapper>
    <Container
      delay={`-${delay.current * animationDuration}ms`}
    >
      <svg viewBox="25 25 50 50" xmlns="http://www.w3.org/2000/svg">
        <circle
          fill="none"
          strokeWidth={5}
          strokeLinecap="round"
          strokeMiterlimit="10"
          cx="50"
          cy="50"
          r="20"
        />
      </svg>
    </Container>
    </Wrapper>
  );
};
export default LoadingOverlay;
