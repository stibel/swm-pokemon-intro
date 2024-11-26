import { StyleSheet } from 'react-native';
import {
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';

import { Camera } from 'react-native-vision-camera';
import { ThemedText } from '@/components/ThemedText';
import { detectObjects } from '@/utils/plugin_setup';

export default function CameraScreen() {
  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission()

  if (!hasPermission) {
    requestPermission();
  }

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    const objects = detectObjects(frame);
    console.log(`Objects in frame ${objects}`)
  }, [])

  if (!hasPermission) return <ThemedText> no permission </ThemedText>
  if (device == null) return <ThemedText> no device </ThemedText>

  return (
    <Camera
      frameProcessor={frameProcessor}
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
  )
}