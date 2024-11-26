import Vision
import MLKitFaceDetection
import MLKitVision
import CoreML
import UIKit
import AVFoundation

@objc(MyFrameProcessorPlugin)
public class MyFrameProcessorPlugin: NSObject, FrameProcessorPluginBase {
    static var FaceDetectorOption: FaceDetectorOptions = {
        let option = FaceDetectorOptions()
        option.contourMode = .all
        option.classificationMode = .all
        option.landmarkMode = .all
        option.performanceMode = .accurate
        return option
    }()

    static var faceDetector = FaceDetector.faceDetector(options: FaceDetectorOption)

    private static func processContours(from face: Face) -> [String: [[String: CGFloat]]] {
        let faceContoursTypes = [
            FaceContourType.face, FaceContourType.leftEyebrowTop, FaceContourType.leftEyebrowBottom, // More types...
           ]
        var faceContoursTypesMap = [String: [[String: CGFloat]]]()

        for i in 0..<faceContoursTypes.count {
            guard let contour = face.contour(ofType: faceContoursTypes[i]), let points = contour.points else { continue }

            let pointsArray = points.map { ["x": $0.x, "y": $0.y] }
            faceContoursTypesMap[faceContoursTypes[i].description] = pointsArray
        }
        return faceContoursTypesMap
    }

    public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?) -> Any? {
        let image = VisionImage(buffer: frame.buffer)
        image.orientation = .up

        var faceAttributes: [Any] = []

        do {
            let faces = try faceDetector.results(in: image)
            for face in faces {
                var map: [String: Any] = [
                    "rollAngle": face.headEulerAngleZ, 
                    "pitchAngle": face.headEulerAngleX, 
                    "yawAngle": face.headEulerAngleY, 
                    "leftEyeOpenProbability": face.leftEyeOpenProbability,
                    "rightEyeOpenProbability": face.rightEyeOpenProbability,
                    "smilingProbability": face.smilingProbability,
                    "bounds": processBoundingBox(from: face),
                    "contours": processContours(from: face)
                ]
                faceAttributes.append(map)
            }
        } catch {
            // Consider logging the error or handling it accordingly
            return nil
        }

        return faceAttributes
    }
}