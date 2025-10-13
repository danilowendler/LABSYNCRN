// Tema DASA para React Native
export const theme = {
  colors: {
    primary: '#0D274D', // DASA Dark Blue
    secondary: '#5AC3E5', // DASA Light Blue
    accent: '#ff751f', // DASA Orange
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#FFFFFF',
    gray: '#6c757d',
    lightGray: '#e9ecef',
  },
  gradients: {
    primary: ['#0D274D', '#1a4273', '#5AC3E5', '#0D274D'],
    screen1: ['#0D274D', '#1a4273', '#5AC3E5', '#0D274D'],
  },
  fonts: {
    regular: 'Inter_400Regular',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};
