import { create } from 'zustand';

export type VerificationPhase = 'idle' | 'pulse' | 'eyeTracking' | 'microSaccades' | 'fusion' | 'complete' | 'failed';

interface VerificationResult {
    trustScore: number;
    rppgSignal: number;
    eyeMovement: number;
    microSaccades: number;
    pulseVariability: string;
    zkpProofId: string;
}

interface AppState {
    // Onboarding
    hasOnboarded: boolean;
    isEnrolled: boolean;
    setOnboarded: (value: boolean) => void;
    setEnrolled: (value: boolean) => void;

    // Verification
    verificationPhase: VerificationPhase;
    verificationProgress: number;
    heartRate: number;
    eyeTrackingAccuracy: number;
    verificationResult: VerificationResult | null;
    isVerifying: boolean;

    // Actions
    startVerification: () => void;
    updateProgress: (progress: number) => void;
    setPhase: (phase: VerificationPhase) => void;
    setHeartRate: (hr: number) => void;
    setEyeTrackingAccuracy: (acc: number) => void;
    completeVerification: (result: VerificationResult) => void;
    failVerification: (result: VerificationResult) => void;
    resetVerification: () => void;

    // Settings
    isDarkMode: boolean;
    toggleDarkMode: () => void;

    // Recent Activity
    recentActivity: Array<{
        id: string;
        title: string;
        time: string;
        status: 'success' | 'pending' | 'info';
    }>;
}

export const useAppStore = create<AppState>((set) => ({
    // Onboarding
    hasOnboarded: false,
    isEnrolled: false,
    setOnboarded: (value) => set({ hasOnboarded: value }),
    setEnrolled: (value) => set({ isEnrolled: value }),

    // Verification
    verificationPhase: 'idle',
    verificationProgress: 0,
    heartRate: 0,
    eyeTrackingAccuracy: 0,
    verificationResult: null,
    isVerifying: false,

    // Actions
    startVerification: () =>
        set({
            isVerifying: true,
            verificationPhase: 'pulse',
            verificationProgress: 0,
            heartRate: 0,
            eyeTrackingAccuracy: 0,
            verificationResult: null,
        }),

    updateProgress: (progress) => set({ verificationProgress: progress }),

    setPhase: (phase) => set({ verificationPhase: phase }),

    setHeartRate: (hr) => set({ heartRate: hr }),

    setEyeTrackingAccuracy: (acc) => set({ eyeTrackingAccuracy: acc }),

    completeVerification: (result) =>
        set({
            isVerifying: false,
            verificationPhase: 'complete',
            verificationProgress: 100,
            verificationResult: result,
        }),

    failVerification: (result) =>
        set({
            isVerifying: false,
            verificationPhase: 'failed',
            verificationProgress: 0,
            verificationResult: result,
        }),

    resetVerification: () =>
        set({
            isVerifying: false,
            verificationPhase: 'idle',
            verificationProgress: 0,
            heartRate: 0,
            eyeTrackingAccuracy: 0,
            verificationResult: null,
        }),

    // Settings
    isDarkMode: true,
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

    // Recent Activity
    recentActivity: [
        { id: '1', title: 'Banking Wire Approved', time: '10:45 AM', status: 'success' },
        { id: '2', title: 'Account Login', time: 'Yesterday 3:22 PM', status: 'info' },
        { id: '3', title: 'Document Signature', time: 'Feb 21, 12:18 AM', status: 'success' },
        { id: '4', title: 'Identity Check', time: 'Feb 20, 8:30 PM', status: 'pending' },
    ],
}));
