import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
} as const;

export const FontSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
    hero: 64,
} as const;

export const FontWeights = {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
};

export const BorderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    round: 999,
} as const;

export const Screen = {
    width,
    height,
    isSmall: width < 375,
    isMedium: width >= 375 && width < 414,
    isLarge: width >= 414,
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
} as const;
