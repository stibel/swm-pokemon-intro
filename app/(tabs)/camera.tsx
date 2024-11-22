import { Image, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

export default function ProfileScreen() {
  const device = useCameraDevice('front')
  const { hasPermission, requestPermission } = useCameraPermission()

  if (!hasPermission) {
    requestPermission();
  }
  if (device == null) return <ThemedText>no deviceno deviceno deviceno deviceno deviceno device</ThemedText>

  return (
    <ThemedView style={{ flex: 1 }}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
    </ThemedView>
  );
}