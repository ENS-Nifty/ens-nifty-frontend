export const colors = {
  white: '255, 255, 255',
  black: '0, 0, 0',
  dark: '34, 34, 34',
  grey: '221, 221, 221',
  blue: '64, 109, 187',
  yellow: '246, 203, 71',
  green: '79, 180, 128',
  red: '221, 69, 65'
};

export const fonts = {
  size: {
    small: '12px',
    medium: '16px',
    large: '18px',
    big: '22px',
    h1: '42px',
    h2: '32px',
    h3: '24px',
    h4: '20px',
    h5: '17px',
    h6: '14px'
  },
  weight: {
    thin: 300,
    normal: 400,
    semibold: 500,
    bold: 700
  }
};

export const transitions = {
  short: 'all 0.1s ease-in-out',
  base: 'all 0.2s ease-in-out',
  long: 'all 0.3s ease-in-out'
};

export const responsive = {
  xs: {
    min: 'min-width: 479px',
    max: 'max-width: 480px'
  },
  sm: {
    min: 'min-width: 639px',
    max: 'max-width: 640px'
  },
  md: {
    min: 'min-width: 959px',
    max: 'max-width: 960px'
  },
  lg: {
    min: 'min-width: 1023px',
    max: 'max-width: 1024px'
  }
};

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700');

  html, body, #root, #router-root {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    background: rgb(${colors.lightGrey});
    font-family: Roboto, sans-serif;
    font-weight: ${fonts.weight.normal};
    font-style: normal;
  	font-stretch: normal;
    font-size: ${fonts.size.medium};
    color: rgb(${colors.dark});
    overflow-y:auto;
    text-rendering: optimizeLegibility;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  	-webkit-text-size-adjust: 100%;
    -webkit-overflow-scrolling: touch;
  }

  button:active,
  button:focus,
  button.active {
    background-image: none;
    outline: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }

  [tabindex] {
    outline: none;
    height: 100%;
  }

  a, p, h1, h2, h3, h4, h5, h6 {
  	text-decoration: none;
  	margin: 0;
  	padding: 0;
  }

  h1 {
    font-size: ${fonts.size.h1}
  }
  h2 {
    font-size: ${fonts.size.h2}
  }
  h3 {
    font-size: ${fonts.size.h3}
  }
  h4 {
    font-size: ${fonts.size.h4}
  }
  h5 {
    font-size: ${fonts.size.h5}
  }
  h6 {
    font-size: ${fonts.size.h6}
  }

  a {
    text-decoration: none;
    color: inherit;
    outline: none;
  }

  ul, li {
  	list-style: none;
  	margin: 0;
  	padding: 0;
  }

  * {
    box-sizing: border-box !important;
  }

  button {
    border-style: none;
    line-height: 1em;
  }

  input {
    -webkit-appearance: none;
  }

  input[type="color"],
  input[type="date"],
  input[type="datetime"],
  input[type="datetime-local"],
  input[type="email"],
  input[type="month"],
  input[type="number"],
  input[type="password"],
  input[type="search"],
  input[type="tel"],
  input[type="text"],
  input[type="time"],
  input[type="url"],
  input[type="week"],
  select:focus,
  textarea {
    font-size: 16px;
  }
`;
