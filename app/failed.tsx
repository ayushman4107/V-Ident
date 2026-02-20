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
    withRepeat,
    withSequence,
    Easing,
    FadeInDown,
    FadeIn,
} from 'react-native-reanimated';
import Svg, { Circle, Path, Line, Defs, RadialGradient, Stop, Polygon, Rect } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../src/theme';
import { NeonButton, GlowCard, ParticleBackground } from '../src/components';
import { useAppStore } from '../src/store/appStore';

const { width } = Dimensions.get('window');

export default function FailedScreen() {
    const { resetVerification } = useAppStore();
    const shakeX = useSharedValue(0);
    const glitchOpacity = useSharedValue(0);
    const scanlineOffset = useSharedValue(0);

    useEffect(() => {
        // Screen shake effect
        shakeX.value = withSequence(
            withTiming(8, { duration: 50 }),
            withTiming(-8, { duration: 50 }),
            withTiming(6, { duration: 50 }),
            withTiming(-6, { duration: 50 }),
            withTiming(3, { duration: 50 }),
            withTiming(0, { duration: 50 })
        );

        // Glitch effect
        glitchOpacity.value = withRepeat(
            withSequence(
                withTiming(0.3, { duration: 100 }),
                withTiming(0, { duration: 200 }),
                withTiming(0.15, { duration: 50 }),
                withTiming(0, { duration: 2000 })
            ),
            -1,
            false
        );

        // Scanline animation
        scanlineOffset.value = withRepeat(
            withTiming(1, { duration: 3000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const shakeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shakeX.value }],
    }));

    const glitchStyle = useAnimatedStyle(() => ({
        opacity: glitchOpacity.value,
    }));

    return (
        <LinearGradient colors={['#1A0515', '#0A0A1F', '#0A0510']} style={styles.container}>
            <ParticleBackground particleCount={15} />

            {/* Red vignette overlay */}
            <Animated.View style={[styles.vignette, glitchStyle]} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={shakeStyle}>
                    {/* Header */}
                    <Animated.View entering={FadeIn.duration(600)} style={styles.headerSection}>
                        <Text style={styles.title}>Verification Failed</Text>
                        <Text style={styles.subtitleBadge}>LOW CONFIDENCE SCORE</Text>
                    </Animated.View>

                    {/* Score Display */}
                    <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.scoreSection}>
                        <View style={styles.scoreGlow}>
                            <Text style={styles.trustLabel}>TRUST SCORE</Text>
                            <Text style={styles.scoreValue}>78.3%</Text>
                            <Text style={styles.scoreThreshold}>BELOW THRESHOLD (95%)</Text>
                        </View>
                    </Animated.View>

                    {/* AI Artifact Detected */}
                    <Animated.View entering={FadeInDown.delay(500).duration(600)}>
                        <View style={styles.artifactCard}>
                            <LinearGradient
                                colors={['rgba(255, 51, 102, 0.12)', 'rgba(255, 51, 102, 0.05)']}
                                style={styles.artifactGradient}
                            >
                                {/* Header */}
                                <View style={styles.artifactHeader}>
                                    <Ionicons name="warning" size={20} color={Colors.warning} />
                                    <Text style={styles.artifactTitle}>AI Artifact Detected</Text>
                                </View>

                                <Text style={styles.artifactDesc}>
                                    Our explainable AI system identified anomalies consistent with synthetic media or deepfake generation:
                                </Text>

                                {/* Bullet points */}
                                <View style={styles.bulletList}>
                                    <BulletItem
                                        icon="heart-pulse"
                                        text="Unnatural lack of pulse variability in forehead region (rPPG confidence: 68.2%)"
                                        delay={700}
                                    />
                                    <BulletItem
                                        icon="eye-outline"
                                        text="Eye movement patterns outside human range"
                                        delay={800}
                                    />
                                    <BulletItem
                                        icon="eye-off-outline"
                                        text="Micro-saccade frequency anomaly detected"
                                        delay={900}
                                    />
                                </View>
                            </LinearGradient>
                        </View>
                    </Animated.View>

                    {/* Recommended Action */}
                    <Animated.View entering={FadeInDown.delay(1000).duration(600)}>
                        <GlowCard
                            glowColor={Colors.warningGlow}
                            borderColor={Colors.warningDim}
                            style={styles.recommendCard}
                        >
                            <View style={styles.recommendHeader}>
                                <Ionicons name="information-circle" size={18} color={Colors.neonMagenta} />
                                <Text style={styles.recommendTitle}>RECOMMENDED ACTION</Text>
                            </View>
                            <Text style={styles.recommendText}>
                                Connect with a human compliance officer for video-based identity verification.
                            </Text>
                        </GlowCard>
                    </Animated.View>

                    {/* Action Buttons */}
                    <Animated.View entering={FadeInDown.delay(1200).duration(500)} style={styles.actionsSection}>
                        <NeonButton
                            title=" Connect to Human Compliance Officer"
                            onPress={() => {
                                // In production, this would open a video call
                                resetVerification();
                                router.replace('/dashboard');
                            }}
                            variant="secondary"
                            size="large"
                            fullWidth
                            icon={<Ionicons name="videocam" size={18} color={Colors.white} />}
                        />

                        <View style={{ height: Spacing.md }} />

                        <NeonButton
                            title="Try Again Later"
                            onPress={() => {
                                resetVerification();
                                router.replace('/dashboard');
                            }}
                            variant="ghost"
                            size="medium"
                            fullWidth
                        />
                    </Animated.View>
                </Animated.View>
            </ScrollView>
        </LinearGradient>
    );
}

// Bullet item component
const BulletItem: React.FC<{
    icon: string;
    text: string;
    delay: number;
}> = ({ icon, text, delay: animDelay }) => (
    <Animated.View entering={FadeInDown.delay(animDelay).duration(400)}>
        <View style={styles.bulletItem}>
            <View style={styles.bulletDot}>
                <MaterialCommunityIcons name={icon as any} size={14} color={Colors.warning} />
            </View>
            <Text style={styles.bulletText}>{text}</Text>
        </View>
    </Animated.View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    vignette: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 51, 102, 0.15)',
        zIndex: 1,
        pointerEvents: 'none',
    },
    scrollContent: {
        paddingTop: 70,
        paddingHorizontal: Spacing.lg,
        paddingBottom: 50,
        zIndex: 2,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: 30,
        fontWeight: FontWeights.extrabold,
        color: Colors.textPrimary,
        textAlign: 'center',
        letterSpacing: 2,
        textShadowColor: Colors.warning,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    subtitleBadge: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.bold,
        color: Colors.warning,
        letterSpacing: 3,
        marginTop: Spacing.sm,
        paddingHorizontal: Spacing.md,
        paddingVertical: 4,
        borderRadius: BorderRadius.round,
        borderWidth: 1,
        borderColor: Colors.warningDim,
        backgroundColor: 'rgba(255, 51, 102, 0.1)',
        overflow: 'hidden',
    },
    scoreSection: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    scoreGlow: {
        alignItems: 'center',
        padding: Spacing.xl,
        borderRadius: BorderRadius.xl,
        backgroundColor: 'rgba(255, 51, 102, 0.06)',
        borderWidth: 1,
        borderColor: Colors.warningDim,
        width: '100%',
        shadowColor: Colors.warning,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 8,
    },
    trustLabel: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.bold,
        color: Colors.textSecondary,
        letterSpacing: 3,
        marginBottom: Spacing.sm,
    },
    scoreValue: {
        fontSize: 72,
        fontWeight: FontWeights.extrabold,
        color: Colors.warning,
        textShadowColor: Colors.warning,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
        lineHeight: 80,
    },
    scoreThreshold: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.bold,
        color: Colors.textMuted,
        letterSpacing: 2,
        marginTop: Spacing.sm,
    },
    artifactCard: {
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.warningDim,
        overflow: 'hidden',
        marginBottom: Spacing.lg,
    },
    artifactGradient: {
        padding: Spacing.lg,
    },
    artifactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    artifactTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: Colors.warning,
    },
    artifactDesc: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
        lineHeight: 20,
        marginBottom: Spacing.md,
    },
    bulletList: {
        gap: Spacing.md,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.sm,
    },
    bulletDot: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: 'rgba(255, 51, 102, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    bulletText: {
        flex: 1,
        fontSize: FontSizes.sm,
        color: Colors.textPrimary,
        lineHeight: 20,
        fontWeight: FontWeights.medium,
    },
    recommendCard: {
        marginBottom: Spacing.xl,
    },
    recommendHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    recommendTitle: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.bold,
        color: Colors.neonMagenta,
        letterSpacing: 2,
    },
    recommendText: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    actionsSection: {
        marginTop: Spacing.sm,
    },
});
