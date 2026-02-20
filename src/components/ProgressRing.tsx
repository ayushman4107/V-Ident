import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Colors, FontSizes, FontWeights } from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
    progress: number; // 0-100
    size?: number;
    strokeWidth?: number;
    color?: string;
    secondaryColor?: string;
    showLabel?: boolean;
    label?: string;
    labelColor?: string;
    animated?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
    progress,
    size = 140,
    strokeWidth = 8,
    color = Colors.success,
    secondaryColor,
    showLabel = true,
    label,
    labelColor = Colors.textPrimary,
    animated = true,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const animatedProgress = useSharedValue(0);

    useEffect(() => {
        if (animated) {
            animatedProgress.value = withTiming(progress, {
                duration: 1500,
                easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
            });
        } else {
            animatedProgress.value = progress;
        }
    }, [progress]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference - (circumference * animatedProgress.value) / 100;
        return {
            strokeDashoffset,
        };
    });

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} style={styles.svg}>
                <Defs>
                    <SvgGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={color} />
                        <Stop offset="100%" stopColor={secondaryColor || color} />
                    </SvgGradient>
                </Defs>
                {/* Background circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={Colors.bgCard}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress circle */}
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#ringGradient)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>
            {showLabel && (
                <View style={styles.labelContainer}>
                    <Text style={[styles.value, { color: labelColor, fontSize: size * 0.22 }]}>
                        {label || `${progress.toFixed(1)}%`}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    svg: {
        position: 'absolute',
    },
    labelContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        fontWeight: FontWeights.bold,
        letterSpacing: 1,
    },
});
