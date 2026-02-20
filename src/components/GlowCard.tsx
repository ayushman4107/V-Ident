import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing } from '../theme';

interface GlowCardProps {
    children: React.ReactNode;
    glowColor?: string;
    borderColor?: string;
    style?: ViewStyle;
    noBorder?: boolean;
}

export const GlowCard: React.FC<GlowCardProps> = ({
    children,
    glowColor = Colors.neonCyanGlow,
    borderColor = Colors.border,
    style,
    noBorder = false,
}) => {
    return (
        <View
            style={[
                styles.card,
                {
                    borderColor: noBorder ? 'transparent' : borderColor,
                    shadowColor: glowColor,
                },
                style,
            ]}
        >
            <LinearGradient
                colors={['rgba(17, 17, 53, 0.9)', 'rgba(15, 15, 45, 0.7)']}
                style={styles.gradient}
            >
                {children}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    gradient: {
        padding: Spacing.md,
        borderRadius: BorderRadius.lg - 1,
    },
});
