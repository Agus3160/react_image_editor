import { Expand } from "lucide-react";
import { useResizeDrag } from "../../hooks/resize&Drag/useResizeDrag";
import React, { useState } from "react";
import CustomFont from "../ImgEditor/CustomFont";
import { TextBox as TextEditor, Axis } from "../../lib/definitions";

type Props = {
  tabIndex?: number;
  className?: string;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  pos: Axis;
  setPos: (pos: Axis) => void;
  size: Axis;
  setSize: (size: Axis) => void;
  minSize?: number;
  text:TextEditor;
};

export default function TextBox({
  tabIndex = 0,
  className,
  onFocus,
  onBlur,
  pos,
  setPos,
  size,
  setSize,
  minSize = 25,
  text,
}: Props) {
  const [focus, setFocus] = useState(true);

  const draggableRef = React.useRef<HTMLDivElement>(null);
  const resizeButtonRef = React.useRef<HTMLButtonElement>(null);

  useResizeDrag({
    pos,
    setPos,
    size,
    setSize,
    minSize,
    draggableRef,
    resizeButtonRef,
  });

  return (
    <div
      className={`${className} ${
        focus
          ? "hover:cursor-move outline outline-1 outline-blue-500 bg-black bg-opacity-50 rounded"
          : ""
      } p-[1.5px] `}
      tabIndex={tabIndex}
      ref={draggableRef}
      onFocus={(e) => {
        onFocus && onFocus(e);
        setFocus(true);
      }}
      onBlur={(e) => {
        onBlur && onBlur(e);
        if (
          draggableRef.current &&
          !draggableRef.current.contains(e.relatedTarget)
        )
          setFocus(false);
      }}
      style={{
        position: "absolute",
        top: pos.y,
        left: pos.x,
        width: size.x,
        height: size.y,
      }}
    >
      <button
        className={`duration-300 absolute top-[calc(100%-12px)] right-[-12px] p-1 bg-blue-500 rounded-full ${
          focus ? "opacity-100" : "opacity-0"
        }`}
        type="button"
        ref={resizeButtonRef}
      >
        <Expand size={16} />
      </button>
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
    </div>
  );
}
