import { EditImageConfig } from "../context/EditImageContext";
import {
  StyleBorderEnum,
  TextBox,
  TEXT_SHADOW_CANVAS,
  TEXT_SHADOW_CANVAS_RESET,
  SpaceStyleEnum,
  SpaceImgConfigType,
  Axis
} from "./definitions";

const saveImage = (config: EditImageConfig) => {
  const { img: imgageConfig, textBox, space } = config;

  const containerPreview = document.getElementById("preview-container");

  if (!containerPreview) throw new Error("No preview container found");

  const textBoxes = textBox.boxes;
  const imageUrl = imgageConfig.url;
  const scale = { scaleX: imgageConfig.scaleX, scaleY: imgageConfig.scaleY };

  // If no text box is found, throw an error
  if (textBoxes.length === 0) throw new Error("No text box found");

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageUrl;
  img.onload = () => {
    // Create a canvas dynamically
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("No context found");

    const previewScale = { x: img.width/containerPreview.clientWidth , y: img.height/containerPreview.clientHeight };

    // Draw the image
    drawImageByScaleXY(ctx, canvas, img, scale, space);

    // Draw Text boxes
    drawTextBoxes(textBoxes, ctx, previewScale);

    // Save the canvas content as an image
    const imageData = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = imageData;
    a.download = "image.png";
    a.click();
  };
};

const drawTextBoxes = (textBoxes: TextBox[], ctx: CanvasRenderingContext2D, scale:Axis) => {
  for (let i = 0; i < textBoxes.length; i++) {
    let text: TextBox = scaleTextBox(textBoxes[i], scale);

    ctx.font = `${text.fontSize}px ${text.fontFamily}`;
    ctx.fillStyle = text.color;

    if (text.styleBorder === StyleBorderEnum.solid)
      applyBorder(ctx, text.borderColor);
    else resetBorder(ctx);

    if (text.textAlign === "center") {
      drawCenteredText(ctx, text);
    } else if (text.textAlign === "right") {
      drawRightAlignedText(ctx, text);
    } else {
      drawLeftAlignedText(ctx, text); // Default alignment (left)
    }
  }
};

const scaleTextBox = (text: TextBox, scale:Axis={ x: 1, y: 1 }) => {
  const auxFontSize = text.fontSize;
  const {x,y} = scale;

  console.log(x,y)
  const newText = {
    ...text,
    x: Math.round(text.x * x),
    y: Math.round(text.y * y),
    width: Math.floor(text.width * x),
    height: Math.round(text.height * y),
    fontSize: Math.round(text.fontSize * x),
    lineHeight: Math.round(text.lineHeight * y * auxFontSize),
  };

  return newText;
};

const drawCenteredText = (ctx: CanvasRenderingContext2D, text: TextBox) => {
  let lines = wrapText(ctx, text);
  let startY = text.y + text.fontSize;

  lines.forEach((line, index) => {
    const textWidth = ctx.measureText(line).width;
    const xPos = text.x + (text.width - textWidth) / 2;
    ctx.fillText(line, xPos, startY + index * text.lineHeight);
  });
};

const drawRightAlignedText = (ctx: CanvasRenderingContext2D, text: TextBox) => {
  let lines = wrapText(ctx, text);
  let startY = text.y + text.fontSize;

  lines.forEach((line, index) => {
    const textWidth = ctx.measureText(line).width;
    const xPos = text.x + text.width - textWidth;
    ctx.fillText(line, xPos, startY + index * text.lineHeight);
  });
};

const drawLeftAlignedText = (ctx: CanvasRenderingContext2D, text: TextBox) => {
  let lines = wrapText(ctx, text);
  let startY = text.y + text.fontSize;

  lines.forEach((line, index) => {
    ctx.fillText(line, text.x, startY + index * text.lineHeight);
  });
};

const wrapText = (ctx: CanvasRenderingContext2D, text: TextBox) => {
  let words = text.text.split(" ");
  let lines: string[] = [];
  let line = "";
  let testLine: string;
  let testWidth: number;
  for (let i = 0; i < words.length; i++) {
    testLine = line + (line ? " " : "") + words[i];
    testWidth = ctx.measureText(testLine).width;

    if (testWidth > text.width) {
      if (line) lines.push(line.trim());
      line = words[i];
    } else line = testLine;
  }
  if (line) lines.push(line.trim());
  return lines;
};

const applyBorder = (ctx: CanvasRenderingContext2D, borderColor: string) => {
  ctx.shadowColor = borderColor;
  ctx.shadowBlur = TEXT_SHADOW_CANVAS.shadowBlur;
  ctx.shadowOffsetX = TEXT_SHADOW_CANVAS.shadowOffsetX;
  ctx.shadowOffsetY = TEXT_SHADOW_CANVAS.shadowOffsetY;
};

const resetBorder = (ctx: CanvasRenderingContext2D) => {
  ctx.shadowColor = TEXT_SHADOW_CANVAS_RESET.shadowColor;
  ctx.shadowBlur = TEXT_SHADOW_CANVAS_RESET.shadowBlur;
  ctx.shadowOffsetX = TEXT_SHADOW_CANVAS_RESET.shadowOffsetX;
  ctx.shadowOffsetY = TEXT_SHADOW_CANVAS_RESET.shadowOffsetY;
};

const drawImageByScaleXY = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  scale: { scaleX: number; scaleY: number },
  space: SpaceImgConfigType
) => {
  const { scaleX, scaleY } = scale;

  ctx.save(); // Guardar el estado actual

  canvas.height = img.height;
  canvas.width = img.width;

  const { color, style } = space;

  const useSpace = style !== SpaceStyleEnum.none;

  const dy = useSpace ? calculateSpace(space, canvas.height) : 0;

  canvas.height = canvas.height + dy;

  // Aplicar color de fondo si es necesario
  if (useSpace) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.scale(scaleX, scaleY); // Aplicar la transformación de escalado

  // Calcular la posición inicial corregida para voltear
  const x = scaleX === -1 ? -canvas.width : 0;

  let y = 0;
  y = scaleY === -1 ? -canvas.height : 0;

  y += (
    style === SpaceStyleEnum.top ? 
      dy 
    : style === SpaceStyleEnum.bottom ? 
      0
    : 
      dy / 2
  );

  // Dibujar la imagen con el tamaño original
  ctx.drawImage(img, x, y, canvas.width, canvas.height - dy);

  ctx.restore(); // Restaurar el estado para deshacer la transformación

  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset scale to 1 for normal text drawing
};

const calculateSpace = (
  space: { style: SpaceStyleEnum; sizePercent: number },
  heigth: number
) => {
  const spaceHeight =
    space.sizePercent *
    heigth *
    (SpaceStyleEnum.bottom === space.style || SpaceStyleEnum.top === space.style
      ? 1
      : 2);
  return spaceHeight;
};

export { saveImage, scaleTextBox, drawImageByScaleXY };
