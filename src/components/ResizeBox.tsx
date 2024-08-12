import { useState } from "react";
import { Expand } from "lucide-react";

export type Axis = {
  x: number;
  y: number;
};

type Props = {
  pos: Axis;
  size: Axis;
  isFocused: boolean;
  handleGetFocused: () => void;
  handleLostFocus: () => void;
  setSize: (size: Axis) => void;
  setPos: (pos: Axis) => void;
  children: React.ReactNode;
  minSize?: number;
  parentElement: HTMLDivElement | null;
};

function Resizeable({
  children,
  pos,
  size,
  setSize,
  setPos,
  isFocused,
  minSize = 50,
  handleGetFocused,
  parentElement,
}: Props) {
  const [isResizing, setIsResizing] = useState(false);

  const desactivateUserSelect = () => {
    document.body.style.userSelect = "none";
  };

  const activateUserSelect = () => {
    document.body.style.userSelect = "auto";
  };

  const handleMove = (
    startMousePosition: Axis,
    onMove: (x: number, y: number) => void
  ) => {
    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!parentElement) return;

      const pageX = "pageX" in e ? e.pageX : (e as TouchEvent).touches[0].pageX;
      const pageY = "pageY" in e ? e.pageY : (e as TouchEvent).touches[0].pageY;

      onMove(pageX - startMousePosition.x, pageY - startMousePosition.y);
    };

    const onMouseUp = () => {
      document.body.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("touchmove", onMouseMove);
      document.body.removeEventListener("mouseup", onMouseUp);
      document.body.removeEventListener("touchend", onMouseUp);
      activateUserSelect();
      setIsResizing(false);
    };

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp);
    document.body.addEventListener("touchmove", onMouseMove);
    document.body.addEventListener("touchend", onMouseUp);
  };

  const dragHandler = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (isResizing) return;
    desactivateUserSelect();
    const startPosition = pos;
    const startMousePosition = {
      x:
        "pageX" in event
          ? event.pageX
          : (event as unknown as TouchEvent).touches[0].pageX,
      y:
        "pageY" in event
          ? event.pageY
          : (event as unknown as TouchEvent).touches[0].pageY,
    };

    handleMove(startMousePosition, (dx, dy) => {
      const newPosX = startPosition.x + dx;
      const newPosY = startPosition.y + dy;

      const maxX = parentElement?.clientWidth! - size.x;
      const maxY = parentElement?.clientHeight! - size.y;

      setPos({
        x: Math.max(0, Math.min(newPosX, maxX)),
        y: Math.max(0, Math.min(newPosY, maxY)),
      });
    });
  };

  const resizeHandler = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setIsResizing(true);
    desactivateUserSelect();
    const startSize = size;
    const startPosition = {
      x:
        "pageX" in event
          ? event.pageX
          : (event as unknown as TouchEvent).touches[0].pageX,
      y:
        "pageY" in event
          ? event.pageY
          : (event as unknown as TouchEvent).touches[0].pageY,
    };

    handleMove(startPosition, (dx, dy) => {
      if (!parentElement) return;

      const newWidth = Math.max(
        minSize,
        Math.min(startSize.x + dx, parentElement.clientWidth - pos.x)
      );
      const newHeight = Math.max(
        minSize,
        Math.min(startSize.y + dy, parentElement.clientHeight - pos.y)
      );

      setSize({
        x: newWidth,
        y: newHeight,
      });
    });
  };

  return (
    <div
      draggable="false"
      onMouseDown={(e) => {
        dragHandler(e);
        handleGetFocused();
      }}
      onTouchStart={(e) => {
        dragHandler(e);
        handleGetFocused();
      }}
      className={`absolute hover:cursor-move ${
        isFocused ? "outline outline-1 outline-blue-500 rounded" : ""
      }`}
      style={{
        backgroundColor: isFocused ? "rgba(0, 0, 0, 0.5)" : "transparent",
        top: pos.y,
        left: pos.x,
        width: size.x,
        height: size.y,
        zIndex: 20,
      }}
    >
      <div className="w-full relative h-full">
        {children}
        {isFocused && (
          <button
            className="absolute top-[calc(100%-12px)] right-[-12px] p-1 bg-blue-500 rounded-full"
            type="button"
            onMouseDown={(e) => resizeHandler(e)}
            onTouchStart={(e) => resizeHandler(e)}
          >
            <Expand size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Resizeable;
