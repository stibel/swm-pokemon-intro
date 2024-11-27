import { PaintStyle, SkColor, Skia } from "@shopify/react-native-skia"

export const getPaint = (options: { style?: PaintStyle, strokeWidth?: number, color: SkColor }) => {
    'worklet'

    const paint = Skia.Paint();
    paint.setStyle(options.style ?? PaintStyle.Fill);
    paint.setStrokeWidth(options.strokeWidth ?? 1);
    paint.setColor(options.color);
    return paint;
}