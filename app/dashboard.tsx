import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
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
    FadeInUp,
} from 'react-native-reanimated';
import Svg, {
    Circle,
    Polygon,
    Line,
    Path,
    Defs,
    RadialGradient,
    Stop,
    G,
} from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Screen } from '../src/theme';
import { NeonButton, GlowCard, ParticleBackground, PulseOrb } from '../src/components';
import { useAppStore } from '../src/store/appStore';

const { width } = Dimensions.get('window');

// Activity item component
const ActivityItem: React.FC<{
    title: string;
    time: string;
    status: 'success' | 'pending' | 'info';
    index: number;
}> = ({ title, time, status, index }) => {
    const statusColors = {
        success: Colors.success,
        pending: Colors.neonCyan,
        info: Colors.neonCyan,
    };
    const statusIcons = {
        success: 'checkmark-circle' as const,
        pending: 'time' as const,
        info: 'information-circle' as const,
    };

    return (
        <Animated.View entering={FadeInDown.delay(300 + index * 100).duration(500)}>
            <TouchableOpacity activeOpacity={0.7}>
                <View style={styles.activityItem}>
                    <View style={[styles.activityDot, { backgroundColor: statusColors[status] }]} />
                    <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>{title}</Text>
                        <Text style={styles.activityTime}>{time}</Text>
                    </View>
                    <Ionicons name={statusIcons[status]} size={18} color={statusColors[status]} />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function DashboardScreen() {
    const { recentActivity } = useAppStore();
    const orbPulse = useSharedValue(1);
    const orbGlow = useSharedValue(0.4);

    useEffect(() => {
        orbPulse.value = withRepeat(
            withSequence(
                withTiming(1.08, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
        orbGlow.value = withRepeat(
            withSequence(
                withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
    }, []);

    const orbAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: orbPulse.value }],
    }));

    const orbGlowStyle = useAnimatedStyle(() => ({
        shadowOpacity: orbGlow.value,
    }));

    return (
        <LinearGradient colors={['#0A0A2F', '#0A0A1F', '#080818']} style={styles.container}>
            <ParticleBackground particleCount={20} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.header}>
                    <View>
                        <Text style={styles.appTitle}>V-IDENT</Text>
                        <Text style={styles.appSubtitle}>PROOF OF PERSONHOOD</Text>
                    </View>
                    <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')}>
                        <Ionicons name="settings-outline" size={22} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </Animated.View>

                {/* Main Orb */}
                <Animated.View
                    entering={FadeInUp.delay(200).duration(800)}
                    style={styles.orbSection}
                >
                    <Animated.View style={[styles.orbGlow, orbGlowStyle]} />
                    <Animated.View style={[styles.orbContainer, orbAnimatedStyle]}>
                        <LinearGradient
                            colors={['#1A1A5C', '#2A0A5C', '#0A0A2F']}
                            style={styles.orbGradient}
                        >
                            <Svg width={160} height={160} viewBox="0 0 160 160">
                                <Defs>
                                    <RadialGradient id="orbBg" cx="50%" cy="50%" rx="50%" ry="50%">
                                        <Stop offset="0%" stopColor="#2A1A6C" stopOpacity="0.8" />
                                        <Stop offset="60%" stopColor="#1A0A4C" stopOpacity="0.4" />
                                        <Stop offset="100%" stopColor="#0A0A2F" stopOpacity="0.1" />
                                    </RadialGradient>
                                </Defs>
                                <Circle cx="80" cy="80" r="75" fill="url(#orbBg)" stroke={Colors.neonCyan} strokeWidth="1" opacity={0.4} />
                                <Circle cx="80" cy="80" r="60" fill="none" stroke={Colors.neonCyanDim} strokeWidth="0.5" strokeDasharray="3 3" />
                                {/* Inner hexagon */}
                                <Polygon
                                    points="80,25 120,47.5 120,92.5 80,115 40,92.5 40,47.5"
                                    fill="none"
                                    stroke={Colors.neonCyan}
                                    strokeWidth="1"
                                    opacity={0.3}
                                />
                                {/* Shield check */}
                                <Path
                                    d="M80 40 L105 52 L105 82 C105 100 80 112 80 112 C80 112 55 100 55 82 L55 52 Z"
                                    fill="none"
                                    stroke={Colors.neonCyan}
                                    strokeWidth="1.5"
                                    opacity={0.5}
                                />
                                <Line x1="68" y1="78" x2="77" y2="87" stroke={Colors.success} strokeWidth="2.5" strokeLinecap="round" />
                                <Line x1="77" y1="87" x2="94" y2="65" stroke={Colors.success} strokeWidth="2.5" strokeLinecap="round" />
                            </Svg>
                        </LinearGradient>
                    </Animated.View>

                    <Text style={styles.orbLabel}>PROOF OF PERSONHOOD</Text>
                    <View style={styles.secureRow}>
                        <Ionicons name="shield-checkmark" size={16} color={Colors.success} />
                        <Text style={styles.secureText}>Identity Anchored: Secure</Text>
                    </View>
                    <Text style={styles.tokenId}>
                        5D1B:B2A0:104A:847F02
                    </Text>
                </Animated.View>

                {/* Human Confidence Card */}
                <Animated.View entering={FadeInDown.delay(400).duration(600)}>
                    <GlowCard glowColor={Colors.neonCyanGlow} style={styles.confidenceCard}>
                        <View style={styles.confidenceRow}>
                            <View style={styles.confidenceLeft}>
                                <View style={styles.confidenceIconRow}>
                                    <View style={styles.confidenceIcon}>
                                        <Ionicons name="finger-print" size={20} color={Colors.neonCyan} />
                                    </View>
                                    <View>
                                        <Text style={styles.confidenceLabel}>Human{'\n'}Confidence</Text>
                                    </View>
                                </View>
                                <Text style={styles.confidenceValue}>99.9%</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.confidenceRight}>
                                <Text style={styles.lastVerifiedLabel}>Last Verified</Text>
                                <Text style={styles.lastVerifiedValue}>2 hours ago</Text>
                            </View>
                        </View>
                    </GlowCard>
                </Animated.View>

                {/* Recent Activity */}
                <Animated.View entering={FadeInDown.delay(500).duration(600)}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <GlowCard style={styles.activityCard}>
                        {recentActivity.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <ActivityItem
                                    title={item.title}
                                    time={item.time}
                                    status={item.status}
                                    index={index}
                                />
                                {index < recentActivity.length - 1 && <View style={styles.separator} />}
                            </React.Fragment>
                        ))}
                    </GlowCard>
                </Animated.View>

                {/* Test New Verification Button */}
                <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.ctaContainer}>
                    <NeonButton
                        title="Test New Verification"
                        onPress={() => router.push('/scan')}
                        variant="primary"
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
        paddingTop: 60,
        paddingHorizontal: Spacing.lg,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.xl,
    },
    appTitle: {
        fontSize: 28,
        fontWeight: FontWeights.extrabold,
        color: Colors.textPrimary,
        letterSpacing: 4,
        textShadowColor: Colors.neonCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    appSubtitle: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.semibold,
        color: Colors.neonCyan,
        letterSpacing: 3,
        marginTop: 4,
        opacity: 0.7,
    },
    settingsBtn: {
        padding: Spacing.sm,
        borderRadius: BorderRadius.round,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: 'rgba(17, 17, 53, 0.6)',
    },
    orbSection: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        position: 'relative',
    },
    orbGlow: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: 'rgba(0, 212, 255, 0.06)',
        shadowColor: Colors.neonCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 40,
        elevation: 15,
        top: -10,
    },
    orbContainer: {
        width: 180,
        height: 180,
        borderRadius: 90,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(0, 212, 255, 0.3)',
        shadowColor: Colors.neonCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orbGradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    orbLabel: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
        fontWeight: FontWeights.semibold,
        letterSpacing: 3,
        marginTop: Spacing.md,
    },
    secureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: Spacing.sm,
    },
    secureText: {
        fontSize: FontSizes.sm,
        color: Colors.success,
        fontWeight: FontWeights.medium,
    },
    tokenId: {
        fontSize: FontSizes.xs,
        color: Colors.textMuted,
        fontFamily: 'monospace',
        marginTop: 6,
        letterSpacing: 1,
    },
    confidenceCard: {
        marginBottom: Spacing.lg,
    },
    confidenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    confidenceLeft: {
        flex: 1,
    },
    confidenceIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    confidenceIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderWidth: 1,
        borderColor: Colors.neonCyanDim,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confidenceLabel: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
        fontWeight: FontWeights.medium,
        lineHeight: 18,
    },
    confidenceValue: {
        fontSize: 36,
        fontWeight: FontWeights.extrabold,
        color: Colors.textPrimary,
        marginTop: Spacing.sm,
        textShadowColor: Colors.neonCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    divider: {
        width: 1,
        height: 60,
        backgroundColor: Colors.border,
        marginHorizontal: Spacing.md,
    },
    confidenceRight: {
        flex: 0.7,
        alignItems: 'flex-start',
    },
    lastVerifiedLabel: {
        fontSize: FontSizes.xs,
        color: Colors.textMuted,
        fontWeight: FontWeights.medium,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    lastVerifiedValue: {
        fontSize: FontSizes.md,
        color: Colors.textSecondary,
        fontWeight: FontWeights.semibold,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    activityCard: {
        marginBottom: Spacing.lg,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm + 2,
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: Spacing.md,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
        color: Colors.textPrimary,
    },
    activityTime: {
        fontSize: FontSizes.xs,
        color: Colors.textMuted,
        marginTop: 2,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.borderLight,
    },
    ctaContainer: {
        marginTop: Spacing.sm,
    },
});
