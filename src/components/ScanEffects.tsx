import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import Svg, { Rect, Line, Circle as SvgCircle } from 'react-native-svg';
import { Colors } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Scan line that moves vertically
export const ScanLine: React.FC<{ height?: number; color?: string }> = ({
    height = 300,
    color = Colors.neonCyan,
}) => {
    const translateY = useSharedValue(0);

    useEffect(() => {
        translateY.value = withRepeat(
            withSequence(
                withTiming(height, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
    }, [height]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View
            style={[
                styles.scanLine,
                {
                    backgroundColor: color,
                    shadowColor: color,
                    width: SCREEN_WIDTH * 0.7,
                },
                animatedStyle,
            ]}
        />
    );
};

// Scanning frame corners
export const ScanFrame: React.FC<{
    size?: number;
    color?: string;
    borderWidth?: number;
}> = ({ size = 250, color = Colors.neonCyan, borderWidth = 3 }) => {
    const cornerLength = size * 0.15;
    const pulseOpacity = useSharedValue(0.6);

    useEffect(() => {
        pulseOpacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: pulseOpacity.value,
    }));

    return (
        <Animated.View style={[styles.scanFrame, { width: size, height: size }, animatedStyle]}>
            {/* Top-left corner */}
            <View style={[styles.corner, styles.topLeft]}>
                <View style={[styles.cornerH, { width: cornerLength, borderColor: color, borderTopWidth: borderWidth }]} />
                <View style={[styles.cornerV, { height: cornerLength, borderColor: color, borderLeftWidth: borderWidth }]} />
            </View>
            {/* Top-right corner */}
            <View style={[styles.corner, styles.topRight]}>
                <View style={[styles.cornerH, { width: cornerLength, borderColor: color, borderTopWidth: borderWidth }]} />
                <View style={[styles.cornerV, { height: cornerLength, borderColor: color, borderRightWidth: borderWidth }]} />
            </View>
            {/* Bottom-left corner */}
            <View style={[styles.corner, styles.bottomLeft]}>
                <View style={[styles.cornerH, { width: cornerLength, borderColor: color, borderBottomWidth: borderWidth }]} />
                <View style={[styles.cornerV, { height: cornerLength, borderColor: color, borderLeftWidth: borderWidth }]} />
            </View>
            {/* Bottom-right corner */}
            <View style={[styles.corner, styles.bottomRight]}>
                <View style={[styles.cornerH, { width: cornerLength, borderColor: color, borderBottomWidth: borderWidth }]} />
                <View style={[styles.cornerV, { height: cornerLength, borderColor: color, borderRightWidth: borderWidth }]} />
            </View>
        </Animated.View>
    );
};

// Glowing dot for eye-tracking challenge
export const GlowingDot: React.FC<{
    x: number;
    y: number;
    size?: number;
    color?: string;
}> = ({ x, y, size = 18, color = Colors.neonMagenta }) => {
    const scale = useSharedValue(0.8);
    const glow = useSharedValue(0.5);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.3, { duration: 500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.8, { duration: 500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
        glow.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.4, { duration: 500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        shadowOpacity: glow.value,
    }));

    return (
        <Animated.View
            style={[
                styles.dot,
                {
                    left: x - size / 2,
                    top: y - size / 2,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                    shadowColor: color,
                },
                animatedStyle,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    scanLine: {
        height: 2,
        position: 'absolute',
        alignSelf: 'center',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    scanFrame: {
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
    },
    topLeft: {
        top: 0,
        left: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        alignItems: 'flex-end',
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        justifyContent: 'flex-end',
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    cornerH: {
        position: 'absolute',
    },
    cornerV: {
        position: 'absolute',
    },
    dot: {
        position: 'absolute',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 15,
        elevation: 8,
    },
});
