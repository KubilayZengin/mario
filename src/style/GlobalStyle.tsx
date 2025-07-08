import { createGlobalStyle } from 'styled-components';
import { colors } from './theme';

export default createGlobalStyle`
  * {
    box-sizing: border-box;

    &:after, &:before {
      box-sizing: border-box;
    }
  }

  html,
  body {
    width: 100%;
    margin: 0;
    padding: 0;
    line-height: 1;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    touch-action: manipulation;
    background-color: ${colors.surface.background};
    color: ${colors.content.primary};

    -webkit-text-size-adjust: none;
    touch-action: pan-y;
    scroll-behavior: smooth;

    @media (max-width: 700px) {
      scroll-behavior: auto;
    }
  }

  body, textarea, input, button {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-family: "Nunito Sans", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings: "wdth" 100, "YTLC" 500;
    color: #111111;
  }

  button, input, textarea {
    outline: none;
    border: none;
    -webkit-appearance: none;
    background-color: transparent;
    text-align: left;
  }

  button {
    cursor: pointer;
    user-select: none;
    padding: 0;
    margin: 0;
  }

  a {
    text-decoration: none;

    &:hover {
      text-decoration: none;
    }

    &:active {
      text-decoration: none;
    }
  }

  textarea {
    resize: none;
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  * {
    backface-visibility: hidden;
  }

  div {
    &:focus {
      outline: none;
    }
  }

  .source-link {
    font-weight: 600;
    text-decoration: none;
    color: ${colors.content.accent}; 
    vertical-align: super;
    font-size: 0.7em;
    padding: 0 2px;
    /* This new line tells the browser to not allow selecting this element */
    user-select: none;
    
    &:hover {
      text-decoration: underline;
      background-color: ${colors.surface.layer};
    }
  }

  /* This rule correctly hides the links when printing */
  @media print {
    .source-link {
      display: none;
    }
  }
`;
