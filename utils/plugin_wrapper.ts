import { Frame, VisionCameraProxy } from "react-native-vision-camera"

const plugin = VisionCameraProxy.initFrameProcessorPlugin('MyFrameProcessor', {})

/**
 * Scans faces.
 */
export function detectFaces(frame: Frame): object {
    'worklet'
    if (plugin == null) throw new Error('Failed to load Frame Processor Plugin "scanFaces"!')
    return plugin.call(frame)
}