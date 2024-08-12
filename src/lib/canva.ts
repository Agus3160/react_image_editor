import {
  StyleBorderEnum,
  TextBox,
  TEXT_SHADOW_CANVAS,
  TEXT_SHADOW_CANVAS_RESET,
} from "./definitions";

const saveImage = (imageUrl: string, textBoxes: TextBox[], scaleX: number) => {

  // If no text box is found, throw an error
  if (textBoxes.length === 0) throw new Error("No text box found");

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageUrl;
  img.onload = () => {
    // Create a canvas dynamically
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("No context found");

    // Draw the image
    drawImageByScaleX(ctx, canvas, img, scaleX);

    // Draw Text boxes
    drawTextBoxes(textBoxes, ctx);

    // Save the canvas content as an image
    const imageData = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = imageData;
    a.download = "image.png";
    a.click();
  };
};

const drawTextBoxes = (textBoxes: TextBox[], ctx: CanvasRenderingContext2D) => {
  for (let i = 0; i < textBoxes.length; i++) {
    let text: TextBox = {
      ...textBoxes[i],
      lineHeight: Math.round(textBoxes[i].lineHeight * textBoxes[i].fontSize),
    };

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

const scaleTextBox = (text: TextBox, scale: number) => {
  const auxFontSize = text.fontSize;

  const newText = {
    ...text,
    x: Math.round(text.x * scale),
    y: Math.round(text.y * scale),
    width: Math.floor(text.width * scale),
    height: Math.round(text.height * scale),
    fontSize: Math.round(text.fontSize * scale),
    lineHeight: Math.round(text.lineHeight * scale * auxFontSize),
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

const drawImageByScaleX = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement, scaleX: number) => {
  // Draw the image with scaling
  if (scaleX < 0) {
    ctx.save(); // Save the current state
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, img.width, img.height);
    ctx.restore(); // Restore the state to undo the transformation
  } else {
    ctx.drawImage(img, 0, 0, img.width, img.height);
  }

  // Reset transformations for drawing text
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset to default transformation matrix
}

export { saveImage, scaleTextBox };
