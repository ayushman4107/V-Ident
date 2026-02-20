import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    FadeIn,
    SlideInRight,
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
    Rect,
} from 'react-native-svg';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../src/theme';
import { NeonButton, ParticleBackground } from '../src/components';
import { useAppStore } from '../src/store/appStore';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Deepfakes Are\nEverywhere',
        desc: 'In 2026, AI-generated identity fraud causes over $200M in losses. Traditional CAPTCHAs can no longer protect you.',
        color: Colors.warning,
    },
    {
        id: '2',
        title: 'Your Body Is\nYour Key',
        desc: 'V-IDENT uses real-time heartbeat detection, eye tracking, and micro-saccade analysis to prove you are a living human.',
        color: Colors.neonCyan,
    },
    {
        id: '3',
        title: 'Privacy First,\nAlways',
        desc: 'Zero-Knowledge Proofs ensure your biometrics never leave your device. Verify your humanity without revealing your identity.',
        color: Colors.success,
    },
];

// SVG icons for each slide
const SlideIcon: React.FC<{ index: number; color: string }> = ({ index, color }) => {
    const size = 140;
    if (index === 0) {
        return (
            <Svg width={size} height={size} viewBox="0 0 140 140">
                <Defs>
                    <RadialGradient id="bg0" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor={color} stopOpacity="0.15" />
                        <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </RadialGradient>
                </Defs>
                <Circle cx="70" cy="70" r="60" fill="url(#bg0)" stroke={color} strokeWidth="1.5" strokeDasharray="4 4" />
                {/* Warning triangle */}
                <Polygon points="70,30 105,95 35,95" fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
                <Line x1="70" y1="55" x2="70" y2="75" stroke={color} strokeWidth="3" strokeLinecap="round" />
                <Circle cx="70" cy="83" r="2.5" fill={color} />
            </Svg>
        );
    }
    if (index === 1) {
        return (
            <Svg width={size} height={size} viewBox="0 0 140 140">
                <Defs>
                    <RadialGradient id="bg1" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor={color} stopOpacity="0.15" />
                        <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </RadialGradient>
                </Defs>
                <Circle cx="70" cy="70" r="60" fill="url(#bg1)" stroke={color} strokeWidth="1.5" />
                {/* Heart / pulse */}
                <Path
                    d="M70 90 C50 70, 35 55, 50 42 C60 35, 70 45, 70 45 C70 45, 80 35, 90 42 C105 55, 90 70, 70 90Z"
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                />
                {/* Eye */}
                <Path
                    d="M45 70 Q70 55 95 70 Q70 85 45 70Z"
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    opacity={0.6}
                />
                <Circle cx="70" cy="70" r="5" fill={color} opacity={0.6} />
            </Svg>
        );
    }
    return (
        <Svg width={size} height={size} viewBox="0 0 140 140">
            <Defs>
                <RadialGradient id="bg2" cx="50%" cy="50%" rx="50%" ry="50%">
                    <Stop offset="0%" stopColor={color} stopOpacity="0.15" />
                    <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </RadialGradient>
            </Defs>
            <Circle cx="70" cy="70" r="60" fill="url(#bg2)" stroke={color} strokeWidth="1.5" />
            {/* Shield */}
            <Path
                d="M70 25 L100 40 L100 75 C100 95 70 115 70 115 C70 115 40 95 40 75 L40 40 Z"
                fill="none"
                stroke={color}
                strokeWidth="2"
            />
            {/* Lock */}
            <Rect x="58" y="65" width="24" height="18" rx="3" fill="none" stroke={color} strokeWidth="1.5" />
            <Path d="M63 65 L63 57 C63 50 77 50 77 57 L77 65" fill="none" stroke={color} strokeWidth="1.5" />
            <Circle cx="70" cy="74" r="2" fill={color} />
        </Svg>
    );
};

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const setOnboarded = useAppStore((s) => s.setOnboarded);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
            setCurrentIndex(currentIndex + 1);
        } else {
            setOnboarded(true);
            router.replace('/dashboard');
        }
    };

    const handleSkip = () => {
        setOnboarded(true);
        router.replace('/dashboard');
    };

    const renderSlide = ({ item, index }: { item: typeof slides[0]; index: number }) => (
        <View style={styles.slide}>
            <View style={styles.iconContainer}>
                <SlideIcon index={index} color={item.color} />
            </View>
            <Text style={[styles.slideTitle, { textShadowColor: item.color }]}>
                {item.title}
            </Text>
            <Text style={styles.slideDesc}>{item.desc}</Text>
        </View>
    );

    return (
        <LinearGradient colors={['#0A0A2F', '#0A0A1F', '#050510']} style={styles.container}>
            <ParticleBackground particleCount={15} />

            {/* Skip button */}
            <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            {/* Carousel */}
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderSlide}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={(e) => {
                    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(idx);
                }}
                style={styles.flatList}
            />

            {/* Dots */}
            <View style={styles.dotsContainer}>
                {slides.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: i === currentIndex ? Colors.neonCyan : Colors.textMuted,
                                width: i === currentIndex ? 24 : 8,
                                shadowColor: i === currentIndex ? Colors.neonCyan : 'transparent',
                                shadowOpacity: i === currentIndex ? 0.8 : 0,
                            },
                        ]}
                    />
                ))}
            </View>

            {/* CTA */}
            <View style={styles.ctaContainer}>
                <NeonButton
                    title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                    onPress={handleNext}
                    variant="primary"
                    size="large"
                    fullWidth
                />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    skipBtn: {
        position: 'absolute',
        top: 60,
        right: 24,
        zIndex: 10,
        padding: 8,
    },
    skipText: {
        color: Colors.textSecondary,
        fontSize: FontSizes.md,
        fontWeight: FontWeights.medium,
    },
    flatList: {
        flex: 1,
        marginTop: 100,
    },
    slide: {
        width,
        paddingHorizontal: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginBottom: Spacing.xxl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slideTitle: {
        fontSize: FontSizes.xxxl,
        fontWeight: FontWeights.extrabold,
        color: Colors.textPrimary,
        textAlign: 'center',
        lineHeight: 42,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
        marginBottom: Spacing.lg,
    },
    slideDesc: {
        fontSize: FontSizes.lg,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 26,
        paddingHorizontal: Spacing.md,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: Spacing.xl,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 6,
        elevation: 3,
    },
    ctaContainer: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: 50,
    },
});
