import VisionCamera
import MLKitObjectDetection
import MLKitVision

@objc(MyObjectDetectionPlugin)
public class MyObjectDetectionPlugin: FrameProcessorPlugin {
  public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    super.init(proxy: proxy, options: options)
  }

  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?) -> Any? {
    let options = ObjectDetectorOptions()
    options.shouldEnableClassification = true

    let objectDetector = ObjectDetector.objectDetector(options: options)

    let image = VisionImage(buffer: frame.buffer);
    image.orientation = .up;

    objectDetector.process(image) { objects, error in
      guard error == nil else {
        // Error.
        return
      }
      guard let objects = objects, !objects.isEmpty else {
        // No objects detected.
        print("No objects detected or objects array is nil.")
        return
      }

      // objects contains one item if multiple object detection wasn't enabled.
      for object in objects {
        let frame = object.frame
        let trackingID = object.trackingID

        // If classification was enabled:
        let description = object.labels.enumerated().map { (index, label) in
          "Label \(index): \(label.text), \(label.confidence)"
          }.joined(separator:"\n")
        print(description);
      }
      // Success. Get object info here.
      // ...
    }

    return nil
  }
}
