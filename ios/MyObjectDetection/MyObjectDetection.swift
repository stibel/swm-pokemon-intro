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
    
    // let options = ObjectDetectorOptions()
    // options.shouldEnableClassification = true

    let objectDetector = ObjectDetector.objectDetector(options: options)

    let image = VisionImage(buffer: frame.buffer);
    image.orientation = .up;
    
    var result: [Any] = [];


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
    var res: [[String]];
    
    do {
      objects = try objectDetector.results(in: image);
      res = objects.map{ $0.labels.enumerated().map { (label) in label.element.text } }
    } catch let _error {
    // Handle the error.
      return nil;
    }
//
//    let res = objects.map{ $0.frame }
    let flattenedArray = res.reduce([], { $0 + $1 })
    let resultString = flattenedArray.compactMap({ $0 }).joined(separator: " ")
    print("RETURN", resultString)
    return resultString
  }
}
