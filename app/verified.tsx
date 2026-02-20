import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSequence,
    withRepeat,
    Easing,
    FadeInDown,
    FadeInUp,
    ZoomIn,
} from 'react-native-reanimated';
import Svg, { Circle, Path, Line, Defs, RadialGradient, Stop, Polygon } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../src/theme';
import { NeonButton, GlowCard, ProgressRing, ParticleBackground } from '../src/components';
import { useAppStore } from '../src/store/appStore';

const { width } = Dimensions.get('window');

// Stat card component
const StatCard: React.FC<{
    label: string;
    value: string;
    color: string;
    icon: string;
    delay: number;
}> = ({ label, value, color, icon, delay: animDelay }) => (
    <Animated.View
        entering={FadeInDown.delay(animDelay).duration(500)}
        style={[styles.statCard, { borderColor: color + '40' }]}
    >
        <MaterialCommunityIcons name={icon as any} size={18} color={color} />
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
);

// Verification step component
const VerificationStep: React.FC<{
    icon: string;
    title: string;
    delay: number;
}> = ({ icon, title, delay: animDelay }) => (
    <Animated.View entering={FadeInDown.delay(animDelay).duration(500)}>
        <GlowCard glowColor={Colors.successGlow} style={styles.stepCard}>
            <View style={styles.stepRow}>
                <View style={styles.stepIcon}>
                    <Ionicons name={icon as any} size={18} color={Colors.neonCyan} />
                </View>
                <Text style={styles.stepText}>{title}</Text>
                <View style={styles.stepCheck}>
                    <Ionicons name="checkmark-circle" size={22} color={Colors.success} />
                </View>
            </View>
        </GlowCard>
    </Animated.View>
);

export default function VerifiedScreen() {
    const { verificationResult } = useAppStore();
    const checkScale = useSharedValue(0);
    const glowRadius = useSharedValue(0);
    const successParticles = useSharedValue(0);

    const result = verificationResult || {
        trustScore: 99.9,
        rppgSignal: 98.7,
        eyeMovement: 99.1,
        microSaccades: 99.5,
        pulseVariability: 'Matched',
        zkpProofId: '0x9f3a...1c2d',
    };

    useEffect(() => {
        // Checkmark entrance
        checkScale.value = withDelay(
            200,
            withSequence(
                withTiming(1.2, { duration: 400, easing: Easing.out(Easing.back(2)) }),
                withTiming(1, { duration: 200 })
            )
        );

        // Glow effect
        glowRadius.value = withDelay(
            300,
            withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) })
        );

        // Success particles
        successParticles.value = withDelay(400, withTiming(1, { duration: 600 }));
    }, []);

    const checkAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkScale.value }],
    }));

    const glowAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: glowRadius.value }],
        opacity: glowRadius.value * 0.6,
    }));

    return (
        <LinearGradient colors={['#0A0A2F', '#0A0A1F', '#050510']} style={styles.container}>
            <ParticleBackground particleCount={20} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Success Checkmark */}
                <View style={styles.checkSection}>
                    {/* Glow behind */}
                    <Animated.View style={[styles.checkGlow, glowAnimatedStyle]} />

                    {/* Hexagonal frame with checkmark */}
                    <Animated.View style={[styles.checkContainer, checkAnimatedStyle]}>
                        <Svg width={120} height={120} viewBox="0 0 120 120">
                            <Defs>
                                <RadialGradient id="successBg" cx="50%" cy="50%" rx="50%" ry="50%">
                                    <Stop offset="0%" stopColor={Colors.success} stopOpacity="0.15" />
                                    <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                                </RadialGradient>
                            </Defs>
                            {/* Outer hexagon */}
                            <Polygon
                                points="60,5 105,27.5 105,72.5 60,95 15,72.5 15,27.5"
                                fill="url(#successBg)"
                                stroke={Colors.success}
                                strokeWidth="2"
                            />
                            {/* Inner circle */}
                            <Circle cx="60" cy="50" r="28" fill="none" stroke={Colors.success} strokeWidth="2.5" />
                            {/* Checkmark */}
                            <Path
                                d="M45 50 L55 60 L77 38"
                                fill="none"
                                stroke={Colors.success}
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    </Animated.View>
                </View>

                {/* Title */}
                <Animated.View entering={FadeInDown.delay(500).duration(600)}>
                    <Text style={styles.title}>Human Verified</Text>
                    <Text style={styles.subtitle}>BIOMETRIC AUTHENTICATION SUCCESSFUL</Text>
                </Animated.View>

                {/* Trust Score Ring */}
                <Animated.View entering={ZoomIn.delay(600).duration(600)} style={styles.ringSection}>
                    <View style={styles.ringContainer}>
                        <ProgressRing
                            progress={result.trustScore}
                            size={180}
                            strokeWidth={10}
                            color={Colors.success}
                            secondaryColor={Colors.neonCyan}
                            labelColor={Colors.success}
                        />
                    </View>
                    <Text style={styles.trustLabel}>Human Confidence</Text>
                </Animated.View>

                {/* Stats Grid */}
                <Animated.View entering={FadeInDown.delay(800).duration(600)}>
                    <View style={styles.statsGrid}>
                        <StatCard label="rPPG Signal" value={`${result.rppgSignal}%`} color={Colors.neonCyan} icon="heart-pulse" delay={900} />
                        <StatCard label="Eye Movement" value={`${result.eyeMovement}%`} color={Colors.neonCyan} icon="eye-outline" delay={1000} />
                        <StatCard label="Micro-saccades" value={`${result.microSaccades}%`} color={Colors.success} icon="eye-check" delay={1100} />
                        <StatCard label="Pulse Variability" value={result.pulseVariability} color={Colors.success} icon="sine-wave" delay={1200} />
                    </View>
                </Animated.View>

                {/* Verification Steps */}
                <View style={styles.stepsSection}>
                    <VerificationStep icon="cube-outline" title="Compressing biometric data" delay={1300} />
                    <VerificationStep icon="shield-checkmark-outline" title="Generating Zero-Knowledge Proof on Secure Enclave" delay={1400} />
                    <VerificationStep icon="lock-closed-outline" title="Encrypted Template Matched" delay={1500} />
                </View>

                {/* ZKP ID */}
                <Animated.View entering={FadeInDown.delay(1600).duration(500)}>
                    <GlowCard glowColor={Colors.neonCyanGlow} style={styles.zkpCard}>
                        <View style={styles.zkpRow}>
                            <Text style={styles.zkpLabel}>Zero-Knowledge Proof ID</Text>
                            <View style={styles.zkpIdRow}>
                                <Text style={styles.zkpId}>{result.zkpProofId}</Text>
                                <Ionicons name="copy-outline" size={16} color={Colors.neonCyan} />
                            </View>
                        </View>
                    </GlowCard>
                </Animated.View>

                {/* Return Button */}
                <Animated.View entering={FadeInDown.delay(1800).duration(500)} style={styles.ctaContainer}>
                    <NeonButton
                        title="Return to Dashboard"
                        onPress={() => router.replace('/dashboard')}
                        variant="outline"
                        size="large"
                        fullWidth
                    />
                </Animated.View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 80,
        paddingHorizontal: Spacing.lg,
        paddingBottom: 50,
        alignItems: 'center',
    },
    checkSection: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
        position: 'relative',
    },
    checkGlow: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(0, 255, 157, 0.08)',
        shadowColor: Colors.success,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 40,
        elevation: 15,
    },
    checkContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 34,
        fontWeight: FontWeights.extrabold,
        color: Colors.textPrimary,
        textAlign: 'center',
        letterSpacing: 2,
        textShadowColor: Colors.success,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    subtitle: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.semibold,
        color: Colors.success,
        textAlign: 'center',
        letterSpacing: 3,
        marginTop: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    ringSection: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    ringContainer: {
        shadowColor: Colors.success,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    trustLabel: {
        fontSize: FontSizes.md,
        color: Colors.neonCyan,
        fontWeight: FontWeights.semibold,
        letterSpacing: 2,
        marginTop: Spacing.md,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
        justifyContent: 'center',
        marginBottom: Spacing.xl,
        width: '100%',
    },
    statCard: {
        width: (width - Spacing.lg * 2 - Spacing.md) / 2 - 2,
        backgroundColor: 'rgba(17, 17, 53, 0.8)',
        borderWidth: 1,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        alignItems: 'center',
        gap: 6,
    },
    statValue: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.extrabold,
    },
    statLabel: {
        fontSize: FontSizes.xs,
        color: Colors.textSecondary,
        fontWeight: FontWeights.medium,
        textAlign: 'center',
    },
    stepsSection: {
        gap: Spacing.sm,
        width: '100%',
        marginBottom: Spacing.lg,
    },
    stepCard: {
        marginBottom: 0,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    stepIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderWidth: 1,
        borderColor: Colors.neonCyanDim,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepText: {
        flex: 1,
        fontSize: FontSizes.sm,
        color: Colors.textPrimary,
        fontWeight: FontWeights.medium,
    },
    stepCheck: {},
    zkpCard: {
        width: '100%',
        marginBottom: Spacing.lg,
    },
    zkpRow: {},
    zkpLabel: {
        fontSize: FontSizes.xs,
        color: Colors.textMuted,
        fontWeight: FontWeights.medium,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.sm,
    },
    zkpIdRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    zkpId: {
        fontSize: FontSizes.md,
        color: Colors.neonCyan,
        fontWeight: FontWeights.bold,
        fontFamily: 'monospace',
        letterSpacing: 1,
    },
    ctaContainer: {
        width: '100%',
    },
});
