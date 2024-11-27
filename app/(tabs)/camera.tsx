import { StyleSheet } from 'react-native';
import {
  useCameraDevice,
  useCameraPermission,
  useSkiaFrameProcessor,
} from 'react-native-vision-camera';

import { Camera } from 'react-native-vision-camera';
import { ThemedText } from '@/components/ThemedText';
import { detectObjects } from '@/utils/plugin_setup';
import { SkFont, Skia, useFont } from '@shopify/react-native-skia';

export default function CameraScreen() {
  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission()

  if (!hasPermission) {
    requestPermission();
  }

  const font = useFont(require("../../assets/fonts/SpaceMono-Regular.ttf"), 32);

  if (!font) {
    console.log("Font is not loaded yet");
    return null;
  }

  const frameProcessor = useSkiaFrameProcessor((frame) => {
    'worklet'
    const result = detectObjects(frame);
    frame.render()
    result.forEach((res) => {
      const rect = Skia.XYWHRect(res.frame.x, res.frame.y, res.frame.width, res.frame.height)
      const paint = Skia.Paint()
      paint.setStyle(1);
      paint.setStrokeWidth(10);
      paint.setColor(Skia.Color('red'))
      frame.drawRect(rect, paint)

      // Text background
      const bgPaint = Skia.Paint();
      bgPaint.setColor(Skia.Color('black'));
      // Calculate text metrics for background size
      const metrics = font!.getMetrics();
      const textWidth = font!.measureText(res.labels[0].text).width;
      frame.drawRect(Skia.XYWHRect(res.frame.x, res.frame.y - metrics?.bounds?.height, textWidth, metrics?.bounds?.height), bgPaint);

      // Draw the text
      const textPaint = Skia.Paint();
      textPaint.setColor(Skia.Color('white'));
      frame.drawText(`${res.labels[0].text} ${(res.labels[0].confidence * 100).toFixed(2)}%`, res.frame.x, res.frame.y, textPaint, font as SkFont);
    })
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