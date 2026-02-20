import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { Colors } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
    color: string;
}

const generateParticles = (count: number): Particle[] => {
    const colors = [Colors.neonCyan, Colors.neonMagenta, Colors.success, Colors.neonCyanDim];
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * SCREEN_WIDTH,
        y: Math.random() * SCREEN_HEIGHT,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 3000,
        duration: Math.random() * 3000 + 2000,
        color: colors[Math.floor(Math.random() * colors.length)],
    }));
};

const ParticleItem: React.FC<{ particle: Particle }> = ({ particle }) => {
    const opacity = useSharedValue(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            opacity.value = withRepeat(
                withSequence(
                    withTiming(0.7, { duration: particle.duration, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0, { duration: particle.duration, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                false
            );
        }, particle.delay);
        return () => clearTimeout(timeout);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.particle,
                {
                    left: particle.x,
                    top: particle.y,
                    width: particle.size,
                    height: particle.size,
                    borderRadius: particle.size / 2,
                    backgroundColor: particle.color,
                    shadowColor: particle.color,
                    shadowRadius: particle.size * 3,
                },
                animatedStyle,
            ]}
        />
    );
};

interface ParticleBackgroundProps {
    particleCount?: number;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ particleCount = 30 }) => {
    const particles = useRef(generateParticles(particleCount)).current;

    return (
        <View style={styles.container} pointerEvents="none">
            {particles.map((p) => (
                <ParticleItem key={p.id} particle={p} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    particle: {
        position: 'absolute',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        elevation: 2,
    },
});
