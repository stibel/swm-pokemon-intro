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

//     objectDetector.process(image) { objects, error in
//       guard error == nil else {
//         // Error.
//         return
//       }
//       guard let objects = objects, !objects.isEmpty else {
//         // No objects detected.
//         print("No objects detected or objects array is nil.")
//         return
//       }
//
//       // objects contains one item if multiple object detection wasn't enabled.
//       for object in objects {
//
//         let frame = object.frame
//         let trackingID = object.trackingID
//
//         // If classification was enabled:
//         // print(object)
//         let description = object.labels.enumerated().map { (index, label) in
//           "Label \(index): \(label.text), \(label.confidence)"
//           }.joined(separator:"\n")
//          result.append(description);
//
//          print(description);
//
//          
//       }
//       
//       // Success. Get object info here.
//       // ...
//     }

    var objects: [Object];
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

       print("RETURN", mapped)
       return mapped
  }
}
