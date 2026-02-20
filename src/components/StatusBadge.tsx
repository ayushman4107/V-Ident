import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { Colors, FontSizes, FontWeights, Spacing } from '../theme';

interface StatusBadgeProps {
    label: string;
    value: string;
    color?: string;
    pulse?: boolean;
    icon?: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    label,
    value,
    color = Colors.neonCyan,
    pulse = false,
    icon,
}) => {
    const glowOpacity = useSharedValue(0.3);

    useEffect(() => {
        if (pulse) {
            glowOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                false
            );
        }
    }, [pulse]);

    const animatedStyle = useAnimatedStyle(() => ({
        shadowOpacity: glowOpacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.badge,
                {
                    borderColor: color,
                    shadowColor: color,
                },
                animatedStyle,
            ]}
        >
            <View style={styles.content}>
                {icon && <View style={styles.icon}>{icon}</View>}
                <View style={styles.textContainer}>
                    <Text style={[styles.label, { color: Colors.textSecondary }]}>{label}</Text>
                    <Text style={[styles.value, { color }]}>{value}</Text>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    badge: {
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        backgroundColor: 'rgba(17, 17, 53, 0.8)',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 8,
        elevation: 4,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: Spacing.sm,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.medium,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        marginTop: 2,
    },
});
