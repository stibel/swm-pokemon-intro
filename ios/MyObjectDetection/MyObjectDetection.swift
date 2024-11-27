import VisionCamera
import MLKitObjectDetection
import MLKitVision
import MLKitObjectDetectionCustom
import MLKit

@objc(MyObjectDetectionPlugin)
public class MyObjectDetectionPlugin: FrameProcessorPlugin {
  public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    super.init(proxy: proxy, options: options)
  }

  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?) -> Any? {
  
    guard let modelPath = Bundle.main.path(forResource: "2", ofType: "tflite") else {
      print("Model path is nil")
      return nil;
    }
    let localModel = LocalModel(path: modelPath)

    let options = CustomObjectDetectorOptions(localModel: localModel)
    options.detectorMode = .singleImage
    options.shouldEnableClassification = true
    options.shouldEnableMultipleObjects = true
    options.classificationConfidenceThreshold = NSNumber(value: 0.5)
    options.maxPerObjectLabelCount = 3
    
    let objectDetector = ObjectDetector.objectDetector(options: options)

    let image = VisionImage(buffer: frame.buffer);
    image.orientation = .up;

    var mapped: [Any] = [];
    
    do {
         let objects = try objectDetector.results(in: image)
         mapped = objects.map { object -> [String: Any] in
             let frameDict = [
                 "x": object.frame.origin.x,
                 "y": object.frame.origin.y,
                 "width": object.frame.size.width,
                 "height": object.frame.size.height
             ]
             
             let labels = object.labels.map { label -> [String: Any] in
                 [
                     "text": label.text,
                     "index": label.index,
                     "confidence": label.confidence
                 ]
             }
             
             return [
                 "frame": frameDict,
                 "labels": labels
             ]
         }
       } catch {
           print("Failed to process image with error: \(error)")
           return nil
       }

       return mapped
  }
}
