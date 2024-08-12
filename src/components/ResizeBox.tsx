import { useEffect, useState } from "react";
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

  const desactivateUserSelect = (e: React.MouseEvent<HTMLElement>) => {
    document.body.style.userSelect = "none";
    e.preventDefault();
  };

  const activateUserSelect = () => {
    document.body.style.userSelect = "auto";
  };

  useEffect(() => {
    console.log(window.innerWidth);
  }, [window.innerWidth]);

  const dragHandler = (mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
    if (isResizing) return;
    desactivateUserSelect(mouseDownEvent);
    const startPosition = pos;
    const startMousePosition = {
      x: mouseDownEvent.pageX,
      y: mouseDownEvent.pageY,
    };

    function onMouseMove(mouseMoveEvent: MouseEvent) {
      if (!parentElement) return;

      const newPosX = startPosition.x + (mouseMoveEvent.pageX - startMousePosition.x);
      const newPosY = startPosition.y + (mouseMoveEvent.pageY - startMousePosition.y);

      const maxX = parentElement.clientWidth - size.x;
      const maxY = parentElement.clientHeight - size.y;

      setPos({
        x: Math.max(0, Math.min(newPosX, maxX)),
        y: Math.max(0, Math.min(newPosY, maxY)),
      });
    }

    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
      activateUserSelect();
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  const resizeHandler = (mouseDownEvent: React.MouseEvent<HTMLButtonElement>) => {
    mouseDownEvent.stopPropagation();
    setIsResizing(true);
    desactivateUserSelect(mouseDownEvent);
    const startSize = size;
    const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

    function onMouseMove(mouseMoveEvent: MouseEvent) {
      if (!parentElement) return;

      const newWidth = Math.max(minSize, Math.min(startSize.x + (mouseMoveEvent.pageX - startPosition.x), parentElement.clientWidth - pos.x));
      const newHeight = Math.max(minSize, Math.min(startSize.y + (mouseMoveEvent.pageY - startPosition.y), parentElement.clientHeight - pos.y));

      setSize({
        x: newWidth,
        y: newHeight,
      });
    }

    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
      activateUserSelect();
      setIsResizing(false);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  return (
    <div
      draggable="false"
      onMouseDown={(e) => {
        dragHandler(e)
        handleGetFocused()
      }}
      className={`absolute hover:cursor-move ${isFocused ? "outline outline-1 outline-blue-500 rounded" : ""}`}
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
          >
            <Expand size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Resizeable;
