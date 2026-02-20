import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '../src/theme';

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar style="light" backgroundColor={Colors.bgPrimary} />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: Colors.bgPrimary },
                    animation: 'fade',
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="dashboard" />
                <Stack.Screen name="scan" options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name="verified" options={{ animation: 'fade' }} />
                <Stack.Screen name="failed" options={{ animation: 'fade' }} />
                <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
            </Stack>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgPrimary,
    },
});
