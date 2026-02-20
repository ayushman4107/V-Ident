import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Switch,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../src/theme';
import { NeonButton, GlowCard, ParticleBackground } from '../src/components';
import { useAppStore } from '../src/store/appStore';

const SettingRow: React.FC<{
    icon: string;
    iconFamily?: 'ionicons' | 'material';
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
    onPress?: () => void;
    danger?: boolean;
}> = ({ icon, iconFamily = 'ionicons', title, subtitle, rightElement, onPress, danger }) => {
    const IconComp = iconFamily === 'material' ? MaterialCommunityIcons : Ionicons;
    const iconColor = danger ? Colors.warning : Colors.neonCyan;

    return (
        <TouchableOpacity
            style={styles.settingRow}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={[styles.settingIcon, { borderColor: danger ? Colors.warningDim : Colors.neonCyanDim }]}>
                <IconComp name={icon as any} size={20} color={iconColor} />
            </View>
            <View style={styles.settingText}>
                <Text style={[styles.settingTitle, danger && { color: Colors.warning }]}>{title}</Text>
                {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
            </View>
            {rightElement || (
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            )}
        </TouchableOpacity>
    );
};

export default function SettingsScreen() {
    const { isDarkMode, toggleDarkMode, resetVerification } = useAppStore();
    const [notifications, setNotifications] = useState(true);
    const [biometric, setBiometric] = useState(true);

    const handleDeleteData = () => {
        Alert.alert(
            'Delete All Data',
            'This will permanently delete your biometric templates and verification history. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        resetVerification();
                        Alert.alert('Data Deleted', 'All local data has been cleared.');
                    },
                },
            ]
        );
    };

    return (
        <LinearGradient colors={['#0A0A2F', '#0A0A1F', '#050510']} style={styles.container}>
            <ParticleBackground particleCount={10} />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color={Colors.textSecondary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={{ width: 40 }} />
                </Animated.View>

                {/* Profile Section */}
                <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                    <GlowCard style={styles.profileCard}>
                        <View style={styles.profileRow}>
                            <View style={styles.avatar}>
                                <Ionicons name="person" size={28} color={Colors.neonCyan} />
                            </View>
                            <View style={styles.profileText}>
                                <Text style={styles.profileName}>User</Text>
                                <Text style={styles.profileStatus}>
                                    <Ionicons name="shield-checkmark" size={12} color={Colors.success} /> Verified Human
                                </Text>
                            </View>
                            <View style={styles.trustBadge}>
                                <Text style={styles.trustBadgeText}>99.9%</Text>
                            </View>
                        </View>
                    </GlowCard>
                </Animated.View>

                {/* Preferences */}
                <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <GlowCard style={styles.settingsCard}>
                        <SettingRow
                            icon="moon"
                            title="Dark Mode"
                            subtitle="Cyberpunk theme (always on)"
                            rightElement={
                                <Switch
                                    value={isDarkMode}
                                    onValueChange={toggleDarkMode}
                                    trackColor={{ false: Colors.bgCard, true: Colors.neonCyan }}
                                    thumbColor={Colors.white}
                                />
                            }
                        />
                        <View style={styles.divider} />
                        <SettingRow
                            icon="notifications"
                            title="Push Notifications"
                            subtitle="Verification triggers"
                            rightElement={
                                <Switch
                                    value={notifications}
                                    onValueChange={setNotifications}
                                    trackColor={{ false: Colors.bgCard, true: Colors.neonCyan }}
                                    thumbColor={Colors.white}
                                />
                            }
                        />
                        <View style={styles.divider} />
                        <SettingRow
                            icon="finger-print"
                            title="Biometric Lock"
                            subtitle="Require FaceID/TouchID"
                            rightElement={
                                <Switch
                                    value={biometric}
                                    onValueChange={setBiometric}
                                    trackColor={{ false: Colors.bgCard, true: Colors.neonCyan }}
                                    thumbColor={Colors.white}
                                />
                            }
                        />
                    </GlowCard>
                </Animated.View>

                {/* Security */}
                <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                    <Text style={styles.sectionTitle}>Security & Privacy</Text>
                    <GlowCard style={styles.settingsCard}>
                        <SettingRow
                            icon="shield-checkmark"
                            title="Verification History"
                            subtitle="View past verifications"
                        />
                        <View style={styles.divider} />
                        <SettingRow
                            icon="key"
                            title="ZKP Credentials"
                            subtitle="Manage zero-knowledge proofs"
                        />
                        <View style={styles.divider} />
                        <SettingRow
                            icon="lock-closed"
                            title="Encrypted Storage"
                            subtitle="On-device secure enclave"
                        />
                    </GlowCard>
                </Animated.View>

                {/* Demo */}
                <Animated.View entering={FadeInDown.delay(400).duration(500)}>
                    <Text style={styles.sectionTitle}>Demo</Text>
                    <GlowCard style={styles.settingsCard}>
                        <SettingRow
                            icon="play-circle"
                            title="Run Demo Verification"
                            subtitle="Simulate a successful verification"
                            onPress={() => router.push('/scan')}
                        />
                        <View style={styles.divider} />
                        <SettingRow
                            icon="bug"
                            iconFamily="material"
                            title="Test Failure Mode"
                            subtitle="Simulate a deepfake detection"
                            onPress={() => router.push('/failed')}
                        />
                    </GlowCard>
                </Animated.View>

                {/* Danger Zone */}
                <Animated.View entering={FadeInDown.delay(500).duration(500)}>
                    <Text style={[styles.sectionTitle, { color: Colors.warning }]}>Danger Zone</Text>
                    <GlowCard
                        glowColor={Colors.warningGlow}
                        borderColor={Colors.warningDim}
                        style={styles.settingsCard}
                    >
                        <SettingRow
                            icon="trash"
                            title="Delete All Data"
                            subtitle="Remove biometric templates & history"
                            onPress={handleDeleteData}
                            danger
                        />
                    </GlowCard>
                </Animated.View>

                {/* Version */}
                <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.versionSection}>
                    <Text style={styles.versionText}>V-IDENT v1.0.0</Text>
                    <Text style={styles.versionSub}>AI-Resistant Biometric Verification</Text>
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
        paddingTop: 55,
        paddingHorizontal: Spacing.lg,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(17, 17, 53, 0.8)',
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        color: Colors.textPrimary,
        textAlign: 'center',
        letterSpacing: 1,
    },
    profileCard: {
        marginBottom: Spacing.lg,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderWidth: 1.5,
        borderColor: Colors.neonCyanDim,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileText: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    profileName: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: Colors.textPrimary,
    },
    profileStatus: {
        fontSize: FontSizes.sm,
        color: Colors.success,
        marginTop: 2,
    },
    trustBadge: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.round,
        borderWidth: 1,
        borderColor: Colors.successDim,
        backgroundColor: 'rgba(0, 255, 157, 0.08)',
    },
    trustBadgeText: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.bold,
        color: Colors.success,
    },
    sectionTitle: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.bold,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    settingsCard: {
        marginBottom: Spacing.lg,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.xs,
    },
    settingIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(0, 212, 255, 0.08)',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingText: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    settingTitle: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
        color: Colors.textPrimary,
    },
    settingSubtitle: {
        fontSize: FontSizes.xs,
        color: Colors.textMuted,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: Spacing.sm,
    },
    versionSection: {
        alignItems: 'center',
        marginTop: Spacing.lg,
        paddingBottom: Spacing.xl,
    },
    versionText: {
        fontSize: FontSizes.sm,
        color: Colors.textMuted,
        fontWeight: FontWeights.medium,
    },
    versionSub: {
        fontSize: FontSizes.xs,
        color: Colors.textMuted,
        marginTop: 4,
        opacity: 0.6,
    },
});
