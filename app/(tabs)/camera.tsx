import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

export default function CameraScreen() {
  const device = useCameraDevice('front')
  const { hasPermission, requestPermission } = useCameraPermission()

  if (!hasPermission) {
    requestPermission();
  }

  if (!hasPermission) return <ThemedText> no permission </ThemedText>
  if (device == null) return <ThemedText> no device </ThemedText>
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
  )
}