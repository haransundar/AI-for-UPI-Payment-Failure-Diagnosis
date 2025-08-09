import { createTheme } from '@mui/material/styles';

// BHIM Official Color Palette
export const BHIM_COLORS = {
  // Primary BHIM Colors
  heatWaveOrange: '#FF7909',
  philippineGreen: '#018B3D',
  
  // Orange Variations
  orangeLight: '#FFB366',
  orangeDark: '#E6690A',
  orangeAlpha: 'rgba(255, 121, 9, 0.1)',
  
  // Green Variations
  greenLight: '#4CAF50',
  greenDark: '#015A2A',
  greenAlpha: 'rgba(1, 139, 61, 0.1)',
  
  // Supporting Colors
  white: '#FFFFFF',
  black: '#000000',
  greyLight: '#F5F5F5',
  greyMedium: '#E0E0E0',
  greyDark: '#757575',
  greyText: '#424242',
  
  // Status Colors (BHIM-style)
  success: '#018B3D',
  error: '#FF7909',
  warning: '#FFA726',
  info: '#2196F3',
  
  // Background Colors
  backgroundLight: '#FAFAFA',
  backgroundDark: '#121212',
  cardLight: '#FFFFFF',
  cardDark: '#1E1E1E',
};

// Light Theme (Primary)
export const bhimLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: BHIM_COLORS.heatWaveOrange,
      light: BHIM_COLORS.orangeLight,
      dark: BHIM_COLORS.orangeDark,
      contrastText: BHIM_COLORS.white,
    },
    secondary: {
      main: BHIM_COLORS.philippineGreen,
      light: BHIM_COLORS.greenLight,
      dark: BHIM_COLORS.greenDark,
      contrastText: BHIM_COLORS.white,
    },
    success: {
      main: BHIM_COLORS.philippineGreen,
      light: BHIM_COLORS.greenLight,
      dark: BHIM_COLORS.greenDark,
    },
    error: {
      main: BHIM_COLORS.heatWaveOrange,
      light: BHIM_COLORS.orangeLight,
      dark: BHIM_COLORS.orangeDark,
    },
    warning: {
      main: BHIM_COLORS.warning,
      light: '#FFD54F',
      dark: '#F57C00',
    },
    info: {
      main: BHIM_COLORS.info,
      light: '#64B5F6',
      dark: '#1976D2',
    },
    background: {
      default: BHIM_COLORS.backgroundLight,
      paper: BHIM_COLORS.cardLight,
      elevated: BHIM_COLORS.greyLight,
    },
    text: {
      primary: BHIM_COLORS.greyText,
      secondary: BHIM_COLORS.greyDark,
      disabled: BHIM_COLORS.greyMedium,
    },
    divider: BHIM_COLORS.greyMedium,
    // Custom BHIM gradients
    gradient: {
      primary: `linear-gradient(135deg, ${BHIM_COLORS.heatWaveOrange} 0%, ${BHIM_COLORS.orangeLight} 100%)`,
      secondary: `linear-gradient(135deg, ${BHIM_COLORS.philippineGreen} 0%, ${BHIM_COLORS.greenLight} 100%)`,
      card: `linear-gradient(145deg, ${BHIM_COLORS.white} 0%, ${BHIM_COLORS.greyLight} 100%)`,
    },
  },
  
  // BHIM Typography (Roboto-based)
  typography: {
    fontFamily: '"Roboto", "Noto Sans", "Product Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: BHIM_COLORS.greyText,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: BHIM_COLORS.greyText,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: BHIM_COLORS.greyText,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: BHIM_COLORS.greyText,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: BHIM_COLORS.greyText,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: BHIM_COLORS.greyText,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: BHIM_COLORS.greyText,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: BHIM_COLORS.greyDark,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: BHIM_COLORS.greyDark,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  
  // BHIM Spacing (8px base, generous padding)
  spacing: 8,
  
  // BHIM Shape (rounded corners like BHIM)
  shape: {
    borderRadius: 8,
  },
  
  // Component Overrides (BHIM-style)
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(255, 121, 9, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${BHIM_COLORS.heatWaveOrange} 0%, ${BHIM_COLORS.orangeLight} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${BHIM_COLORS.orangeDark} 0%, ${BHIM_COLORS.heatWaveOrange} 100%)`,
          },
        },
        outlined: {
          borderColor: BHIM_COLORS.heatWaveOrange,
          color: BHIM_COLORS.heatWaveOrange,
          '&:hover': {
            backgroundColor: BHIM_COLORS.orangeAlpha,
            borderColor: BHIM_COLORS.orangeDark,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
          background: BHIM_COLORS.white,
          border: `1px solid ${BHIM_COLORS.greyMedium}`,
          '&:hover': {
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
        colorPrimary: {
          backgroundColor: BHIM_COLORS.orangeAlpha,
          color: BHIM_COLORS.orangeDark,
        },
        colorSecondary: {
          backgroundColor: BHIM_COLORS.greenAlpha,
          color: BHIM_COLORS.greenDark,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: BHIM_COLORS.heatWaveOrange,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: BHIM_COLORS.heatWaveOrange,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${BHIM_COLORS.heatWaveOrange} 0%, ${BHIM_COLORS.orangeLight} 100%)`,
          boxShadow: '0px 2px 12px rgba(255, 121, 9, 0.3)',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: BHIM_COLORS.white,
          borderTop: `1px solid ${BHIM_COLORS.greyMedium}`,
          boxShadow: '0px -2px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: BHIM_COLORS.greyDark,
          '&.Mui-selected': {
            color: BHIM_COLORS.heatWaveOrange,
          },
        },
      },
    },
  },
});

// Dark Theme (BHIM-style dark mode)
export const bhimDarkTheme = createTheme({
  ...bhimLightTheme,
  palette: {
    ...bhimLightTheme.palette,
    mode: 'dark',
    primary: {
      main: BHIM_COLORS.orangeLight,
      light: '#FFD54F',
      dark: BHIM_COLORS.heatWaveOrange,
      contrastText: BHIM_COLORS.black,
    },
    secondary: {
      main: BHIM_COLORS.greenLight,
      light: '#81C784',
      dark: BHIM_COLORS.philippineGreen,
      contrastText: BHIM_COLORS.black,
    },
    background: {
      default: BHIM_COLORS.backgroundDark,
      paper: BHIM_COLORS.cardDark,
      elevated: '#2C2C2C',
    },
    text: {
      primary: BHIM_COLORS.white,
      secondary: '#B3B3B3',
      disabled: '#666666',
    },
    divider: '#333333',
    gradient: {
      primary: `linear-gradient(135deg, ${BHIM_COLORS.orangeLight} 0%, #FFD54F 100%)`,
      secondary: `linear-gradient(135deg, ${BHIM_COLORS.greenLight} 0%, #81C784 100%)`,
      card: `linear-gradient(145deg, ${BHIM_COLORS.cardDark} 0%, #2C2C2C 100%)`,
    },
  },
  components: {
    ...bhimLightTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.3)',
          background: BHIM_COLORS.cardDark,
          border: '1px solid #333333',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: BHIM_COLORS.cardDark,
          borderTop: '1px solid #333333',
          boxShadow: '0px -2px 12px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
});

export default bhimLightTheme;