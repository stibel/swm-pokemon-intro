import { StyleSheet } from 'react-native';
import {
  useCameraDevice,
  useCameraPermission,
  useSkiaFrameProcessor,
} from 'react-native-vision-camera';

import { Camera } from 'react-native-vision-camera';
import { detectObjects } from '@/utils/plugin_setup';
import { Skia, useFont } from '@shopify/react-native-skia';
import { NoCameraPermission } from '@/components/camera/NoCameraPermission';
import { NoCameraDevice } from '@/components/camera/NoCameraDevice';
import { getPaint } from '@/utils/frame_processor/get_paint';

export default function CameraScreen() {
  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission()

  if (!hasPermission) {
    requestPermission();
  }

  const font = useFont(require("../../assets/fonts/SpaceMono-Regular.ttf"), 32);


  const frameProcessor = useSkiaFrameProcessor((frame) => {
    'worklet'

    if (!font) {
      return
    }

    const result = detectObjects(frame);

    frame.render()
    result.forEach((res) => {
      const rect = Skia.XYWHRect(res.frame.x, res.frame.y, res.frame.width, res.frame.height)
      frame.drawRect(rect, getPaint({ style: 1, strokeWidth: 10, color: Skia.Color('red') }))

      const label = res.labels[0];
      const metrics = font!.getMetrics();
      const textWidth = font!.measureText(label.text).width;

      if (metrics.bounds) {
        frame.drawRect(Skia.XYWHRect(res.frame.x, res.frame.y - metrics?.bounds?.height, textWidth, metrics?.bounds?.height), getPaint({ color: Skia.Color('black') }));
      }

      frame.drawText(`${label.text} ${(label.confidence * 100).toFixed(2)}%`, res.frame.x, res.frame.y, getPaint({ color: Skia.Color('white') }), font);
    })
  }, [])

  if (!font) {
    return null;
  }

  if (!hasPermission) return <NoCameraPermission />
  if (!device) return <NoCameraDevice />

  return (
    <Camera
      frameProcessor={frameProcessor}
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
  )
}