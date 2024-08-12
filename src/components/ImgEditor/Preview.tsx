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
  const scaleX = config.img.scaleX;

  const [img, setImg] = useState("");

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

    if(!ctx) throw new Error("No context found");

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
      setImg(base64Img);
    }

  }, [config.img.scaleX]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setFocusIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-[320px] sm:w-[480px] h-auto bg-slate-700 overflow-hidden rounded shadow-md"
    >
      {
        img.length === 0 ?
          <div className="w-full animate-pulse h-72 flex justify-center items-center">
            <Loading size={64} className="text-white  opacity-50" />
          </div>
        :
          <img
          id="preview"
          src={img}
          alt="perro"
          className="object-cover"
          ></img>
      }
      {textBoxes.length > 0 &&
        textBoxes.map((text, index) => {
          return (
            <Resizeable
              key={index}
              parentElement={containerRef.current}
              isFocused={focusIndex === index}
              handleGetFocused={() => {
                setFocusIndex(index)
                setLastFocusIndex(index)
              }}
              handleLostFocus={() => setFocusIndex(null)}
              pos={{ x: textBoxes[index].x, y: textBoxes[index].y }}
              size={{
                x: textBoxes[index].width,
                y: textBoxes[index].height,
              }}
              setPos={(pos) => setPosHandler(index, pos)}
              setSize={(size) => setSizeHanlder(index, size)}
            >
              <CustomFont
                textAlign={text.textAlign}
                styleBorder={text.styleBorder}
                borderColor={text.borderColor}
                fontSize={text.fontSize}
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
