import { createTheme } from '@mui/material/styles';

// Advanced color palette inspired by Google Pay but elevated
const palette = {
  primary: {
    main: '#1976D2', // Primary blue
    light: '#42A5F5',
    dark: '#1565C0',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#00ACC1', // Teal accent
    light: '#26C6DA',
    dark: '#00838F',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  error: {
    main: '#F44336',
    light: '#EF5350',
    dark: '#D32F2F',
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
  },
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
  },
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
    elevated: '#F5F5F5',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
  },
  divider: '#E0E0E0',
  gradient: {
    primary: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
    secondary: 'linear-gradient(135deg, #00ACC1 0%, #26C6DA 100%)',
    success: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
    error: 'linear-gradient(135deg, #F44336 0%, #EF5350 100%)',
    card: 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)',
  },
};

// Dark theme palette
const darkPalette = {
  ...palette,
  mode: 'dark',
  primary: {
    main: '#42A5F5',
    light: '#64B5F6',
    dark: '#1976D2',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#121212',
    paper: '#1E1E1E',
    elevated: '#2C2C2C',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
    disabled: '#666666',
  },
  divider: '#333333',
  gradient: {
    primary: 'linear-gradient(135deg, #42A5F5 0%, #64B5F6 100%)',
    secondary: 'linear-gradient(135deg, #26C6DA 0%, #4DD0E1 100%)',
    success: 'linear-gradient(135deg, #66BB6A 0%, #81C784 100%)',
    error: 'linear-gradient(135deg, #EF5350 0%, #F48FB1 100%)',
    card: 'linear-gradient(145deg, #1E1E1E 0%, #2C2C2C 100%)',
  },
};

// Typography system
const typography = {
  fontFamily: '"Roboto", "Noto Sans", "Product Sans", -apple-system, BlinkMacSystemFont, sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.4,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.4,
    color: '#757575',
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
    letterSpacing: '0.02em',
  },
};

// Spacing system (8px base)
const spacing = 8;

// Breakpoints for responsive design
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

// Shadow system
const shadows = [
  'none',
  '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
  '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)',
  '0px 10px 20px rgba(0, 0, 0, 0.19), 0px 6px 6px rgba(0, 0, 0, 0.23)',
  '0px 14px 28px rgba(0, 0, 0, 0.25), 0px 10px 10px rgba(0, 0, 0, 0.22)',
  '0px 19px 38px rgba(0, 0, 0, 0.30), 0px 15px 12px rgba(0, 0, 0, 0.22)',
];

// Component overrides
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        padding: '12px 24px',
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'none',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.3)',
        },
      },
      contained: {
        background: palette.gradient.primary,
        '&:hover': {
          background: palette.gradient.primary,
          transform: 'translateY(-1px)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        background: palette.gradient.card,
        border: '1px solid rgba(0, 0, 0, 0.04)',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 20,
        fontWeight: 500,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 12,
        },
      },
    },
  },
};

// Create light theme
export const lightTheme = createTheme({
  palette,
  typography,
  spacing,
  breakpoints,
  shadows,
  components,
  shape: {
    borderRadius: 12,
  },
});

// Create dark theme
export const darkTheme = createTheme({
  palette: darkPalette,
  typography,
  spacing,
  breakpoints,
  shadows,
  components: {
    ...components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
          background: darkPalette.gradient.card,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default lightTheme;