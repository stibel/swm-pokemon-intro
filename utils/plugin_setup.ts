import { VisionCameraProxy, Frame } from 'react-native-vision-camera';

const plugin = VisionCameraProxy.initFrameProcessorPlugin('detectObjects', {});

interface Label {
  confidence: number;
  index: number;
  text: string;
}

interface DetectionResult {
  frame: {
    height: number;
    width: number;
    x: number;
    y: number;
  };
  labels: Label[];
}

export function detectObjects(frame: Frame) {
  'worklet';
  if (plugin == null) {
    throw new Error('Failed to load Frame Processor Plugin!');
  }
  return plugin.call(frame) as unknown as DetectionResult[];
}
