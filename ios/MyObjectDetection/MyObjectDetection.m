#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#if __has_include("intropokemon/intropokemon-Swift.h")
#import "intropokemon/intropokemon-Swift.h"
#else
#import "intropokemon-Swift.h"
#endif

VISION_EXPORT_SWIFT_FRAME_PROCESSOR(MyObjectDetectionPlugin, detectObjects)