import { useEffect, useRef, useState } from "react";
import Resizeable, { Axis } from "../ResizeBox";
import CustomFont from "./CustomFont";
import { useEditImageContext } from "../../context/EditImageContext";
import Loading from "../Loading";

export default function Preview() {
  const { config, setTextBoxByIndex, setFocusIndex, setLastFocusIndex } = useEditImageContext();

  const textBoxes = config.textBox.boxes;
  const imageUrl = config.img.url;
  const focusIndex = config.textBox.focusIndex;
  const containerRef = useRef<HTMLDivElement>(null);
  const [img, setImg] = useState("");
  const [containerSize, setContainerSize] = useState({ width: 1, height:1 });
  const [imgDimensions, setImgDimensions] = useState({ width: 1, height:1 });

  const scaleX = config.img.scaleX;

  const setPosHandler = (index: number, pos: Axis) => {
    const newTextBox = { ...textBoxes[index], x: pos.x, y: pos.y };
    setTextBoxByIndex(index, newTextBox);
  };

  const setSizeHanlder = (index: number, size: Axis) => {
    const newTextBox = { ...textBoxes[index], width: size.x, height: size.y };
    setTextBoxByIndex(index, newTextBox);
  };

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("No context found");

    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      if (scaleX < 0) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      } else {
        ctx.scale(1, 1);
      }
      ctx.drawImage(image, 0, 0);
      const base64Img = canvas.toDataURL("image/png");
      setImgDimensions({ width: image.width, height: image.height });
      setImg(base64Img);
    };
  }, [imageUrl, scaleX]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        console.log("clicked outside");
        setFocusIndex(null);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef, setFocusIndex]);
  

  return (
    <div
      ref={containerRef}
      className="relative w-full sm:max-w-[480px] h-auto bg-slate-700 overflow-hidden rounded shadow-md"
    >
      {
        img.length === 0 ?
          <div className="w-full animate-pulse h-72 flex justify-center items-center">
            <Loading size={64} className="text-white opacity-50" />
          </div>
        :
          <img
            id="preview"
            src={img}
            alt="preview"
            draggable={false}
            className="object-cover"
          />
      }
      {textBoxes.length > 0 &&
        textBoxes.map((text, index) => {

          const scaleXFactor = containerSize.width / imgDimensions.width ;
          const scaleYFactor = containerSize.height / imgDimensions.height;

          return (
            <Resizeable
              key={index}
              parentElement={containerRef.current}
              isFocused={focusIndex === index}
              handleGetFocused={() => {
                setFocusIndex(index);
                setLastFocusIndex(index);
              }}
              handleLostFocus={() => setFocusIndex(null)}
              pos={{
                x: text.x * scaleXFactor,
                y: text.y * scaleYFactor,
              }}
              size={{
                x: text.width * scaleXFactor,
                y: text.height * scaleYFactor,
              }}
              setPos={(pos) => setPosHandler(index, {
                x: pos.x / scaleXFactor,
                y: pos.y / scaleYFactor,
              })}
              setSize={(size) => setSizeHanlder(index, {
                x: size.x / scaleXFactor,
                y: size.y / scaleYFactor,
              })}
            >
              <CustomFont
                textAlign={text.textAlign}
                styleBorder={text.styleBorder}
                borderColor={text.borderColor}
                fontSize={text.fontSize * scaleXFactor}
                color={text.color}
                lineHeight={text.lineHeight}
                fontFamily={text.fontFamily}
                text={text.text}
              />
            </Resizeable>
          );
        })}
    </div>
  );
}
