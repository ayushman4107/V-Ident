import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withDelay,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import Svg, { Circle, Polygon, Line, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Colors, FontSizes, FontWeights, Spacing } from '../src/theme';
import { ParticleBackground } from '../src/components';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
    const logoScale = useSharedValue(0.3);
    const logoOpacity = useSharedValue(0);
    const titleOpacity = useSharedValue(0);
    const subtitleOpacity = useSharedValue(0);
    const glowScale = useSharedValue(0);

    useEffect(() => {
        // Logo entrance animation
        logoOpacity.value = withTiming(1, { duration: 800 });
        logoScale.value = withTiming(1, {
            duration: 1200,
            easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
        });

        // Glow effect
        glowScale.value = withDelay(
            400,
            withTiming(1, { duration: 1000, easing: Easing.out(Easing.ease) })
        );

        // Title fade in
        titleOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));

        // Subtitle fade in
        subtitleOpacity.value = withDelay(1000, withTiming(1, { duration: 800 }));

        // Navigate to onboarding after delay
        const timer = setTimeout(() => {
            router.replace('/onboarding');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoScale.value }],
        opacity: logoOpacity.value,
    }));

    const glowAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: glowScale.value }],
        opacity: glowScale.value * 0.6,
    }));

    const titleAnimatedStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{ translateY: (1 - titleOpacity.value) * 20 }],
    }));

    const subtitleAnimatedStyle = useAnimatedStyle(() => ({
        opacity: subtitleOpacity.value,
        transform: [{ translateY: (1 - subtitleOpacity.value) * 15 }],
    }));

    return (
        <LinearGradient
            colors={['#0A0A2F', '#0A0A1F', '#050510']}
            style={styles.container}
        >
            <ParticleBackground particleCount={25} />

            {/* Glow behind logo */}
            <Animated.View style={[styles.glowContainer, glowAnimatedStyle]}>
                <View style={styles.glowCircle} />
            </Animated.View>

            {/* Logo */}
            <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
                <Svg width={120} height={120} viewBox="0 0 120 120">
                    <Defs>
                        <RadialGradient id="orbGrad" cx="50%" cy="50%" rx="50%" ry="50%">
                            <Stop offset="0%" stopColor="#1A1A5C" stopOpacity="0.8" />
                            <Stop offset="70%" stopColor="#0A0A2F" stopOpacity="0.4" />
                            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Circle cx="60" cy="60" r="55" fill="url(#orbGrad)" stroke={Colors.neonCyan} strokeWidth="1.5" />
                    <Polygon
                        points="60,18 95,40 95,80 60,102 25,80 25,40"
                        fill="none"
                        stroke={Colors.neonCyan}
                        strokeWidth="1.5"
                        opacity={0.6}
                    />
                    <Polygon
                        points="60,30 85,45 85,75 60,90 35,75 35,45"
                        fill="none"
                        stroke={Colors.neonMagenta}
                        strokeWidth="1"
                        opacity={0.4}
                    />
                    {/* Shield / checkmark */}
                    <Line x1="48" y1="60" x2="56" y2="68" stroke={Colors.neonCyan} strokeWidth="3" strokeLinecap="round" />
                    <Line x1="56" y1="68" x2="74" y2="48" stroke={Colors.neonCyan} strokeWidth="3" strokeLinecap="round" />
                </Svg>
            </Animated.View>

            {/* Title */}
            <Animated.View style={titleAnimatedStyle}>
                <Text style={styles.title}>V-IDENT</Text>
            </Animated.View>

            {/* Subtitle */}
            <Animated.View style={subtitleAnimatedStyle}>
                <Text style={styles.subtitle}>PROOF OF PERSONHOOD</Text>
                <Text style={styles.tagline}>AI-Resistant Biometric Verification</Text>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glowContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    glowCircle: {
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(0, 212, 255, 0.08)',
        shadowColor: Colors.neonCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 60,
        elevation: 20,
    },
    logoContainer: {
        marginBottom: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 42,
        fontWeight: FontWeights.extrabold,
        color: Colors.textPrimary,
        letterSpacing: 8,
        textShadowColor: Colors.neonCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    subtitle: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.semibold,
        color: Colors.neonCyan,
        letterSpacing: 4,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
    tagline: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: Spacing.sm,
        letterSpacing: 1,
    },
});
