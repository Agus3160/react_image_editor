import { StyleBorderEnum, TEXT_SHADOW_CSS, TextAlignEnum } from "../../lib/definitions";

type Props = {
  fontSize: number;
  color: string;
  lineHeight: number;
  styleBorder: StyleBorderEnum;
  borderColor:string;
  fontFamily: string;
  className?: string;
  text:string;
  textAlign: TextAlignEnum;
}

export default function CustomFont({
  fontSize,
  color,
  styleBorder,
  borderColor,
  fontFamily,
  lineHeight,
  className="",
  text,
  textAlign
}: Props) {
  return (
    <div
      className={`text-boxes h-full w-full ${className}`}
      style={{
        resize: "none",
        fontSize,
        color,
        backgroundColor: "transparent",
        outline: "none",
        fontFamily,
        lineHeight: lineHeight,
        textAlign: textAlign,
        textShadow: styleBorder === StyleBorderEnum.solid ? `${TEXT_SHADOW_CSS} ${borderColor}` : "none",
      }}
      onFocus={(e) => e.preventDefault()}
      onFocusCapture={(e) => e.preventDefault()}
    >
      {text}
    </div>
  )
}