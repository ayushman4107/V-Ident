import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../theme';

interface WaveformProps {
    width?: number;
    height?: number;
    color?: string;
    animated?: boolean;
}

export const Waveform: React.FC<WaveformProps> = ({
    width = 120,
    height = 40,
    color = Colors.neonCyan,
    animated = true,
}) => {
    const phase = useSharedValue(0);

    useEffect(() => {
        if (animated) {
            phase.value = withRepeat(
                withTiming(1, { duration: 2000, easing: Easing.linear }),
                -1,
                false
            );
        }
    }, [animated]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: -phase.value * 20 }],
    }));

    // Generate a heartbeat-like waveform path
    const generateWaveformPath = (): string => {
        const points: string[] = [];
        const segments = 60;
        const segmentWidth = (width + 40) / segments;

        points.push(`M 0 ${height / 2}`);

        for (let i = 0; i < segments; i++) {
            const x = i * segmentWidth;
            const normalizedX = (i / segments) * Math.PI * 6;

            // Create heartbeat-like pattern
            let y = height / 2;
            const beat = i % 15;
            if (beat === 5) y = height * 0.15;
            else if (beat === 6) y = height * 0.85;
            else if (beat === 7) y = height * 0.3;
            else if (beat === 8) y = height * 0.5;
            else y = height / 2 + Math.sin(normalizedX * 2) * 2;

            points.push(`L ${x} ${y}`);
        }

        return points.join(' ');
    };

    return (
        <View style={[styles.container, { width, height }]}>
            <Animated.View style={[{ width: width + 40, height }, animatedStyle]}>
                <Svg width={width + 40} height={height}>
                    <Path
                        d={generateWaveformPath()}
                        stroke={color}
                        strokeWidth={2}
                        fill="transparent"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
            </Animated.View>
        </View>
    );
};

interface PulseOrbProps {
    size?: number;
    color?: string;
}

export const PulseOrb: React.FC<PulseOrbProps> = ({
    size = 200,
    color = Colors.neonCyan,
}) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.6);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.15, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.9, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.orb,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: 'rgba(0, 212, 255, 0.05)',
                    borderColor: color,
                    shadowColor: color,
                },
                animatedStyle,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    orb: {
        borderWidth: 1.5,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
