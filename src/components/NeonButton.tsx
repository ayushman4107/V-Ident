import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing } from '../theme';

interface NeonButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
    fullWidth?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    icon,
    style,
    textStyle,
    fullWidth = false,
}) => {
    const getGradientColors = (): readonly [string, string, ...string[]] => {
        switch (variant) {
            case 'primary':
                return ['#00D4FF', '#0088CC'] as const;
            case 'secondary':
                return ['#FF00AA', '#9900FF'] as const;
            case 'danger':
                return ['#FF3366', '#FF0066'] as const;
            default:
                return ['transparent', 'transparent'] as const;
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, fontSize: FontSizes.sm };
            case 'large':
                return { paddingVertical: Spacing.md + 4, paddingHorizontal: Spacing.xxl, fontSize: FontSizes.lg };
            default:
                return { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, fontSize: FontSizes.md };
        }
    };

    const sizeStyles = getSizeStyles();
    const isOutline = variant === 'outline' || variant === 'ghost';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[
                styles.container,
                fullWidth && styles.fullWidth,
                disabled && styles.disabled,
                style,
            ]}
        >
            {isOutline ? (
                <LinearGradient
                    colors={['rgba(0, 212, 255, 0.1)', 'rgba(0, 212, 255, 0.05)']}
                    style={[
                        styles.gradient,
                        {
                            paddingVertical: sizeStyles.paddingVertical,
                            paddingHorizontal: sizeStyles.paddingHorizontal,
                            borderWidth: 1,
                            borderColor: variant === 'ghost' ? 'transparent' : Colors.neonCyan,
                        },
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color={Colors.neonCyan} size="small" />
                    ) : (
                        <>
                            {icon}
                            <Text
                                style={[
                                    styles.text,
                                    { fontSize: sizeStyles.fontSize, color: Colors.neonCyan },
                                    textStyle,
                                ]}
                            >
                                {title}
                            </Text>
                        </>
                    )}
                </LinearGradient>
            ) : (
                <LinearGradient
                    colors={getGradientColors()}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                        styles.gradient,
                        {
                            paddingVertical: sizeStyles.paddingVertical,
                            paddingHorizontal: sizeStyles.paddingHorizontal,
                        },
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color={Colors.white} size="small" />
                    ) : (
                        <>
                            {icon}
                            <Text style={[styles.text, { fontSize: sizeStyles.fontSize }, textStyle]}>
                                {title}
                            </Text>
                        </>
                    )}
                </LinearGradient>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: BorderRadius.round,
        overflow: 'hidden',
        shadowColor: '#00D4FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.round,
        gap: Spacing.sm,
    },
    text: {
        color: Colors.white,
        fontWeight: FontWeights.bold,
        letterSpacing: 1,
    },
});
