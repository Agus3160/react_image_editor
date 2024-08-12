export enum StyleBorderEnum {
  none = "none",
  solid = "solid",
}

export enum TextAlignEnum {
  left = "left",
  center = "center",
  right = "right",
}

export const defaultValuesTextBox: TextBox = {
  text: "Enter text here",
  fontSize: 24,
  lineHeight: 1.2,
  x: 25,
  y: 25,
  width: 250,
  height: 75,
  color: "#ffffff",
  fontFamily: "Arial",
  styleBorder: StyleBorderEnum.none,
  borderColor: "#000000",
  textAlign: TextAlignEnum.left,
};

export const TEXT_SHADOW_CSS = "2px 4px 3px";

export const TEXT_SHADOW_CANVAS = {
  shadowBlur: 3,
  shadowOffsetX: 2,
  shadowOffsetY: 4,
}

export const TEXT_SHADOW_CANVAS_RESET = {
  shadowColor: 'transparent',
  shadowBlur: 0,             
  shadowOffsetX: 0,           
  shadowOffsetY: 0,
}

export type TextBox = {
  text: string;
  fontSize: number;
  lineHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  fontFamily: string;
  styleBorder: StyleBorderEnum;
  borderColor: string;
  textAlign: TextAlignEnum;
};