import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
    withDelay,
    Easing,
    runOnJS,
    cancelAnimation,
    FadeIn,
    FadeInDown,
} from 'react-native-reanimated';
import Svg, {
    Circle,
    Polygon,
    Line,
    Path,
    Defs,
    RadialGradient,
    Stop,
    Rect,
} from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Screen } from '../src/theme';
import {
    GlowCard,
    ScanFrame,
    Waveform,
    StatusBadge,
    ParticleBackground,
} from '../src/components';
import { useAppStore } from '../src/store/appStore';

const { width, height } = Dimensions.get('window');

const PHASES = [
    { key: 'pulse', label: 'Detecting heartbeat...', icon: 'heart-pulse' },
    { key: 'eyeTracking', label: 'Testing micro-saccades...', icon: 'eye-outline' },
    { key: 'microSaccades', label: 'Analyzing eye patterns...', icon: 'eye-check' },
    { key: 'fusion', label: 'Fusing biometric signals...', icon: 'shield-check' },
];

export default function ScanScreen() {
    const {
        startVerification,
        updateProgress,
        setPhase,
        setHeartRate,
        setEyeTrackingAccuracy,
        completeVerification,
        resetVerification,
    } = useAppStore();

    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [hr, setHr] = useState(0);
    const [eyeAcc, setEyeAcc] = useState(0);
    const [statusText, setStatusText] = useState('Initializing BioSync...');
    const [isScanning, setIsScanning] = useState(false);

    // Animated dot position
    const dotX = useSharedValue(width / 2 - 30);
    const dotY = useSharedValue(150);
    const dotOpacity = useSharedValue(0);

    // Scanning frame animations
    const frameRotation = useSharedValue(0);
    const scanPulse = useSharedValue(0.6);

    // Progress bar animation
    const progressWidth = useSharedValue(0);

    // Phase indicators
    const phase1Complete = useSharedValue(0);
    const phase2Complete = useSharedValue(0);
    const phase3Complete = useSharedValue(0);

    const generateZKPId = () => {
        const hex = '0123456789abcdef';
        let id = '0x';
        for (let i = 0; i < 8; i++) id += hex[Math.floor(Math.random() * 16)];
        id += '...';
        for (let i = 0; i < 4; i++) id += hex[Math.floor(Math.random() * 16)];
        return id;
    };

    useEffect(() => {
        startScan();
        return () => {
            resetVerification();
        };
    }, []);

    const startScan = async () => {
        setIsScanning(true);
        startVerification();

        // Phase 1: Pulse detection (0-25%)
        setStatusText('Detecting heartbeat...');
        setCurrentPhaseIndex(0);
        setPhase('pulse');

        // Simulate HR increasing
        for (let i = 0; i <= 25; i++) {
            await delay(120);
            setProgress(i);
            progressWidth.value = withTiming(i, { duration: 100 });

            if (i > 5) {
                const simulatedHR = 60 + Math.floor(Math.random() * 15);
                setHr(simulatedHR);
                setHeartRate(simulatedHR);
            }
        }
        phase1Complete.value = withTiming(1, { duration: 400 });

        // Phase 2: Eye tracking (25-55%)
        setStatusText('Testing micro-saccades...');
        setCurrentPhaseIndex(1);
        setPhase('eyeTracking');

        // Show dot for eye tracking
        dotOpacity.value = withTiming(1, { duration: 300 });

        // Animate dot in random pattern
        const positions = [
            { x: width * 0.3, y: 120 },
            { x: width * 0.7, y: 180 },
            { x: width * 0.2, y: 200 },
            { x: width * 0.6, y: 100 },
            { x: width * 0.5, y: 160 },
            { x: width * 0.4, y: 220 },
        ];

        for (let i = 0; i <= 30; i++) {
            await delay(100);
            setProgress(25 + i);
            progressWidth.value = withTiming(25 + i, { duration: 100 });

            if (i % 5 === 0) {
                const pos = positions[(i / 5) % positions.length];
                dotX.value = withTiming(pos.x, { duration: 400, easing: Easing.bezierFn(0.25, 0.1, 0.25, 1) });
                dotY.value = withTiming(pos.y, { duration: 400, easing: Easing.bezierFn(0.25, 0.1, 0.25, 1) });
            }

            if (i > 10) {
                setEyeAcc(Math.min(98, 85 + Math.floor(Math.random() * 13)));
            }
        }

        dotOpacity.value = withTiming(0, { duration: 300 });
        phase2Complete.value = withTiming(1, { duration: 400 });

        // Phase 3: Micro-saccades (55-80%)
        setStatusText('Analyzing eye patterns...');
        setCurrentPhaseIndex(2);
        setPhase('microSaccades');

        for (let i = 0; i <= 25; i++) {
            await delay(100);
            setProgress(55 + i);
            progressWidth.value = withTiming(55 + i, { duration: 100 });
        }
        phase3Complete.value = withTiming(1, { duration: 400 });

        // Phase 4: Fusion (80-100%)
        setStatusText('Fusing biometric signals...');
        setCurrentPhaseIndex(3);
        setPhase('fusion');

        for (let i = 0; i <= 20; i++) {
            await delay(120);
            setProgress(80 + i);
            progressWidth.value = withTiming(80 + i, { duration: 100 });
        }

        // Simulate encryption phase
        setStatusText('Finalizing secure enclave encryption...');
        await delay(1500);

        // Complete and navigate
        const result = {
            trustScore: 99.9,
            rppgSignal: 98.7,
            eyeMovement: 99.1,
            microSaccades: 99.5,
            pulseVariability: 'Matched',
            zkpProofId: generateZKPId(),
        };

        completeVerification(result);
        setIsScanning(false);
        router.replace('/verified');
    };

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const dotAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: dotX.value }, { translateY: dotY.value }],
        opacity: dotOpacity.value,
    }));

    const progressAnimatedStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value}%` as any,
    }));

    return (
        <LinearGradient colors={['#0A0A2F', '#0A0A1F', '#050510']} style={styles.container}>
            <ParticleBackground particleCount={12} />

            {/* Header */}
            <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
                <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => {
                        resetVerification();
                        router.back();
                    }}
                >
                    <Ionicons name="close" size={24} color={Colors.textSecondary} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>BioSync Fusion Scan</Text>
                    <Text style={styles.headerSubtitle}>{statusText}</Text>
                </View>
                <View style={{ width: 40 }} />
            </Animated.View>

            {/* Scan Area */}
            <View style={styles.scanArea}>
                {/* Background scan effect */}
                <View style={styles.scanBg}>
                    <LinearGradient
                        colors={['rgba(0, 212, 255, 0.03)', 'rgba(10, 10, 31, 0.9)', 'rgba(0, 212, 255, 0.03)']}
                        style={styles.scanGradient}
                    />
                </View>

                {/* Scan frame */}
                <View style={styles.frameContainer}>
                    <ScanFrame size={220} color={Colors.neonCyan} />

                    {/* Center icon based on phase */}
                    <View style={styles.centerIcon}>
                        <Svg width={80} height={80} viewBox="0 0 80 80">
                            <Defs>
                                <RadialGradient id="scanOrb" cx="50%" cy="50%" rx="50%" ry="50%">
                                    <Stop offset="0%" stopColor={Colors.neonCyan} stopOpacity="0.2" />
                                    <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                                </RadialGradient>
                            </Defs>
                            <Circle cx="40" cy="40" r="35" fill="url(#scanOrb)" />
                            {/* Eye-like shape */}
                            <Path
                                d="M15 40 Q40 20 65 40 Q40 60 15 40Z"
                                fill="none"
                                stroke={Colors.neonCyan}
                                strokeWidth="1.5"
                            />
                            <Circle cx="40" cy="40" r="8" fill="none" stroke={Colors.neonMagenta} strokeWidth="1.5" />
                            <Circle cx="40" cy="40" r="3" fill={Colors.neonMagenta} />
                        </Svg>
                    </View>

                    {/* Instruction text */}
                    <Text style={styles.instructionText}>Follow the glowing dot</Text>
                </View>

                {/* Tracking dot */}
                <Animated.View style={[styles.trackingDot, dotAnimatedStyle]}>
                    <View style={styles.dotInner} />
                    <View style={styles.dotGlow} />
                </Animated.View>
            </View>

            {/* Bottom HUD */}
            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.hud}>
                {/* Progress bar */}
                <View style={styles.progressSection}>
                    <View style={styles.progressLabelRow}>
                        <Text style={styles.progressLabel}>Scan Progress</Text>
                        <Text style={styles.progressValue}>{progress}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <Animated.View style={[styles.progressBarFill, progressAnimatedStyle]}>
                            <LinearGradient
                                colors={['#00D4FF', '#FF00AA']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.progressGradient}
                            />
                        </Animated.View>
                    </View>
                </View>

                {/* Phase indicators */}
                <View style={styles.phaseRow}>
                    <PhaseIndicator
                        icon="heart-pulse"
                        label="Heart Rate"
                        value={hr > 0 ? `${hr}` : '--'}
                        unit="bpm"
                        isActive={currentPhaseIndex === 0}
                        isComplete={currentPhaseIndex > 0}
                    />
                    <PhaseIndicator
                        icon="eye-outline"
                        label="Eye Tracking"
                        value={eyeAcc > 0 ? `${eyeAcc}` : '--'}
                        unit="Accuracy %"
                        isActive={currentPhaseIndex === 1 || currentPhaseIndex === 2}
                        isComplete={currentPhaseIndex > 2}
                    />
                </View>

                {/* rPPG Waveform */}
                <View style={styles.waveformSection}>
                    <View style={styles.waveformHeader}>
                        <Text style={styles.waveformLabel}>rPPG Signal</Text>
                        <View style={styles.liveIndicator}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveText}>LIVE</Text>
                        </View>
                    </View>
                    <Waveform width={width - 80} height={50} color={Colors.neonCyan} animated={isScanning} />
                </View>

                {/* Encryption status */}
                {currentPhaseIndex >= 3 && (
                    <Animated.View entering={FadeIn.duration(400)}>
                        <View style={styles.encryptionRow}>
                            <Ionicons name="lock-closed" size={14} color={Colors.success} />
                            <Text style={styles.encryptionText}>
                                Finalizing secure enclave encryption...
                            </Text>
                        </View>
                        <View style={styles.encryptionDots}>
                            <View style={[styles.encDot, { backgroundColor: Colors.neonCyan }]} />
                            <View style={[styles.encDot, { backgroundColor: Colors.neonMagenta }]} />
                            <View style={[styles.encDot, { backgroundColor: Colors.neonCyan, opacity: 0.4 }]} />
                        </View>
                    </Animated.View>
                )}
            </Animated.View>
        </LinearGradient>
    );
}

// Phase indicator component
const PhaseIndicator: React.FC<{
    icon: string;
    label: string;
    value: string;
    unit: string;
    isActive: boolean;
    isComplete: boolean;
}> = ({ icon, label, value, unit, isActive, isComplete }) => {
    const borderColor = isComplete
        ? Colors.success
        : isActive
            ? Colors.neonCyan
            : Colors.border;
    const textColor = isComplete
        ? Colors.success
        : isActive
            ? Colors.neonCyan
            : Colors.textMuted;

    return (
        <View style={[styles.phaseCard, { borderColor }]}>
            <View style={styles.phaseIconRow}>
                <MaterialCommunityIcons name={icon as any} size={16} color={textColor} />
                <Text style={[styles.phaseLabel, { color: Colors.textSecondary }]}>{label}</Text>
            </View>
            <View style={styles.phaseValueRow}>
                <Text style={[styles.phaseValue, { color: textColor }]}>{value}</Text>
                <Text style={[styles.phaseUnit, { color: Colors.textMuted }]}>{unit}</Text>
            </View>
            {isComplete && (
                <View style={styles.checkBadge}>
                    <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 55,
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(17, 17, 53, 0.8)',
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        color: Colors.textPrimary,
        letterSpacing: 1,
    },
    headerSubtitle: {
        fontSize: FontSizes.sm,
        color: Colors.neonCyan,
        marginTop: 4,
        fontWeight: FontWeights.medium,
    },
    scanArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    scanBg: {
        ...StyleSheet.absoluteFillObject,
    },
    scanGradient: {
        flex: 1,
    },
    frameContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerIcon: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    instructionText: {
        fontSize: FontSizes.lg,
        color: Colors.textPrimary,
        fontWeight: FontWeights.semibold,
        marginTop: Spacing.lg,
        textAlign: 'center',
        textShadowColor: Colors.neonCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    trackingDot: {
        position: 'absolute',
        width: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotInner: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: Colors.neonMagenta,
        shadowColor: Colors.neonMagenta,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 8,
    },
    dotGlow: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 0, 170, 0.2)',
    },
    hud: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: 40,
        paddingTop: Spacing.md,
    },
    progressSection: {
        marginBottom: Spacing.md,
    },
    progressLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    progressLabel: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
        fontWeight: FontWeights.semibold,
    },
    progressValue: {
        fontSize: FontSizes.sm,
        color: Colors.neonCyan,
        fontWeight: FontWeights.bold,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: Colors.bgCard,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressGradient: {
        flex: 1,
        borderRadius: 3,
    },
    phaseRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    phaseCard: {
        flex: 1,
        backgroundColor: 'rgba(17, 17, 53, 0.8)',
        borderWidth: 1,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        position: 'relative',
    },
    phaseIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    phaseLabel: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.medium,
    },
    phaseValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    phaseValue: {
        fontSize: 28,
        fontWeight: FontWeights.extrabold,
    },
    phaseUnit: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.medium,
    },
    checkBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    waveformSection: {
        backgroundColor: 'rgba(17, 17, 53, 0.6)',
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.md,
        marginBottom: Spacing.md,
    },
    waveformHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    waveformLabel: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
        fontWeight: FontWeights.semibold,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.warning,
    },
    liveText: {
        fontSize: FontSizes.xs,
        color: Colors.warning,
        fontWeight: FontWeights.bold,
        letterSpacing: 1,
    },
    encryptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginBottom: Spacing.sm,
    },
    encryptionText: {
        fontSize: FontSizes.sm,
        color: Colors.success,
        fontWeight: FontWeights.medium,
    },
    encryptionDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    encDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
