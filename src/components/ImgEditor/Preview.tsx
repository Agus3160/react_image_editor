import { useEffect, useRef, useState } from "react";
import { useEditImageContext } from "../../context/EditImageContext";
import Loading from "../Loading";
import { drawImageByScaleXY } from "../../lib/canva";
import TextBox from "../TextBox/TextBox";
import { Axis } from "../../lib/definitions";

export default function Preview() {
  const { config, setTextBoxByIndex, setLastFocusIndex } =
    useEditImageContext();

  const textBoxes = config.textBox.boxes;
  const imageUrl = config.img.url;
  const scaleX = config.img.scaleX;
  const scaleY = config.img.scaleY;
  const spaceConfig = config.space;

  const containerRef = useRef<HTMLDivElement>(null);
  const [img, setImg] = useState("");

  const setPosHandler = (index: number, pos: Axis, scale: Axis = { x: 1, y: 1 }) => {
    const newTextBox = { ...textBoxes[index], x: pos.x / scale.x, y: pos.y / scale.y };
    setTextBoxByIndex(index, newTextBox);
  };

  const setSizeHandler = (index: number, size: Axis, scale: Axis = { x: 1, y: 1 }) => {
    const newTextBox = { ...textBoxes[index], width: size.x / scale.x, height: size.y / scale.y };
    setTextBoxByIndex(index, newTextBox);
  };

  const reubicateTextBoxes = (containerHeight: number, containerWidth: number) => {
    const newTextBoxes = textBoxes.map((textBox) => {
      const newY = Math.min(textBox.y, containerHeight - textBox.height);
      const newX = Math.min(textBox.x, containerWidth - textBox.width);
      return { ...textBox, y: newY, x: newX };
    });
    newTextBoxes.forEach((textBox, index) => setTextBoxByIndex(index, textBox));
  };

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("No context found");

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;

    image.onload = () => {
      if (!containerRef.current) throw new Error("No container ref found");
      drawImageByScaleXY(ctx, canvas, image, { scaleX, scaleY }, spaceConfig);
      setImg(canvas.toDataURL("image/png"));
      reubicateTextBoxes(containerRef.current.clientHeight, containerRef.current.clientWidth);
    };
  }, [imageUrl, scaleX, scaleY, spaceConfig]);

  useEffect(() => {
    const container = containerRef.current;
    
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        reubicateTextBoxes(entry.contentRect.height, entry.contentRect.width);
      })
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="preview-container"
      className="relative max-w-[500px] h-auto bg-slate-700 overflow-hidden rounded-none sm:rounded shadow-md"
    >
      {img.length === 0 ? (
        <div className="w-full animate-pulse h-72 flex justify-center items-center">
          <Loading size={64} className="text-white opacity-50" />
        </div>
      ) : (
        <img
          id="preview"
          src={img}
          alt="preview"
          draggable={false}
          className="object-cover"
        />
      )}
      {textBoxes.length > 0 &&
        textBoxes.map((text, index) => {
          return (
            <TextBox
              key={index}
              pos={{ x: text.x, y: text.y }}
              size={{ x: text.width, y: text.height }}
              text={text}
              tabIndex={index}
              onFocus={() => {
                setLastFocusIndex(index)
              }}
              setPos={(pos) => setPosHandler(index, pos)}
              setSize={(size) => setSizeHandler(index, size)}
              minSize={25}
            />
          );
        })}
    </div>
  );
}
