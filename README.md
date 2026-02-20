# V-IDENT: Proof of Personhood & AI-Resistant Verification

**V-IDENT** is a cutting-edge mobile application designed to solve the growing deepfake fraud crisis of 2026. By fusing real-time biometric signals and smartphone sensor data, it provides a "Human Confidence" score that distinguishes real living humans from AI-generated synthetic media.

##  App Purpose
In an era where AI can perfectly mimic faces and voices, traditional CAPTCHAs and biometrics are failing. V-IDENT provides a secure, private, and instant "Proof of Personhood" (PoP) using on-device biometric fusion, ensuring that high-stakes transactions (banking, government, telecommunications) are performed by real humans.

---

## ✨ Key Features

### 1. Cyberpunk-Neon UI
- **Immersive Dark Mode**: Futuristic aesthetics with electric cyan, magenta, and neon green accents.
- **Dynamic Animations**: Smooth transitions, glowing pulse effects, and interactive holographic elements powered by Reanimated.

### 2. BioSync Fusion Scan (The Core)
- **rPPG Pulse Detection**: Real-time heartbeat analysis via camera frame processing.
- **Eye-Hand Challenge**: Active dot-tracking tasks to detect unnatural micro-saccade patterns.
- **Biometric Fusion**: Fuses multiple signals (Heart Rate, Eye Gaze, Saccades) into a single trust score.

### 3. Privacy-First Identity
- **Zero-Knowledge Proofs (ZKP)**: Generates proofs without revealing raw biometric data.
- **On-Device Only**: No biometric data ever leaves your device or is stored in the cloud.
- **Secure Enclave**: Encrypted storage for biometric templates.

### 4. Human Compliance Bridge
- **Fraud Detection**: Automatic flagging of AI artifacts.
- **Expert Escalation**: One-tap connection to human compliance officers if confidence scores are low.

---

## 🛠 Tech Stack

- **Core**: React Native & Expo (Managed Workflow)
- **Language**: TypeScript (Strict Mode)
- **Navigation**: Expo Router (File-based routing)
- **State Management**: Zustand
- **Animations**: React Native Reanimated 3
- **Graphics**: React Native SVG & Expo Linear Gradient
- **Sensors**: Expo Camera & Expo Sensors
- **Storage**: React Native MMKV
- **Camera and Video Processing**: react-native-vision-camera
- **Machine Learning and rPPG**: react-native-fast-tflite
- **Zero-Knowledge Proofs (ZKP)**: snarkjs

---

## 📦 Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository
```bash
git clone <repository-url>
cd vident-app
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Start the application
```bash
npx expo start --clear
```

### 4. Run on Device
Download the **Expo Go** app on your iOS or Android device and scan the QR code generated in your terminal to view the app live.

---

## 📸 Screen Flow
1. **Onboarding**: 3-slide carousel explaining the deepfake problem and V-IDENT solution.
2. **Dashboard**: View your human confidence score and recent activity.
3. **BioSync Scan**: The active verification process with real-time feedback.
4. **Verified/Failed**: Instant reporting of verification results with ZKP generation.

---

**Developed for Sinhgad Hackathon 2026 Hackathon**
