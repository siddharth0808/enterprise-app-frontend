import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    margin: 0;
    font-family: ${({ theme }) => theme.font.family};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    -webkit-font-smoothing: antialiased;
  }

  input, button, select, textarea {
    font-family: inherit;
  }

  button {
    cursor: pointer;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  a {
    color: inherit;
  }
`;
