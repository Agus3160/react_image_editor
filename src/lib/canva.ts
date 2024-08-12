import { StyleBorderEnum, TextBox, TEXT_SHADOW_CANVAS, TEXT_SHADOW_CANVAS_RESET } from "./definitions";

const saveImage = (imageUrl: string, textBoxes: TextBox[]) => {
  const previewImg = document.getElementById("preview");

  if (!previewImg) throw new Error("Preview image not found");

  const previewWidth = previewImg.clientWidth;

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

    // Scale the image
    const newScale = img.width / previewWidth;

    // Draw the image
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Draw Text boxes
    drawTextBoxes(textBoxes, ctx, newScale);

    // Save the canvas content as an image
    const imageData = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = imageData;
    a.download = "image.png";
    a.click();
  };
};

const drawTextBoxes = (
  textBoxes: TextBox[],
  ctx: CanvasRenderingContext2D,
  scale: number,
) => {
  for (let i = 0; i < textBoxes.length; i++) {
    let text = scaleTextBox(textBoxes[i], scale);

    ctx.font = `${text.fontSize}px ${text.fontFamily}`;
    ctx.fillStyle = text.color;

    if (text.styleBorder === StyleBorderEnum.solid) applyBorder(ctx, text.borderColor);
    else resetBorder(ctx);

    if (text.textAlign === 'center') {
      drawCenteredText(ctx, text);
    } else if (text.textAlign === 'right') {
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
    testLine = line + words[i] + " ";
    testWidth = ctx.measureText(testLine).width;

    //Verify if the width is bigger than the maxWidth and remove the last word in case it is a space
    if (testWidth > text.width && testLine[testLine.length-1] === " ") {
      testLine = testLine.slice(0, testLine.length - 1);
      testWidth = ctx.measureText(testLine).width;
    }

    //Verify if the width is bigger than the maxWidth and add the word in case it is not blank
    if (testWidth > text.width && line[line.length-1] !== "") {
      lines.push(line);
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim()); // Add the last line

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

export { saveImage };
