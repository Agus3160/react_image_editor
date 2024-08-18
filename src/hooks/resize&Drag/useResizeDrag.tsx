import { useState, useCallback, useRef, useEffect } from "react";
import { desactivateUserSelect, activateUserSelect } from "./util";
import { Axis } from "../../lib/definitions";

type UseDraggableResizableProps = {
  pos: Axis;
  size: Axis;
  setSize: (size: Axis) => void;
  setPos: (pos: Axis) => void;
  minSize?: number;
  draggableRef: React.RefObject<HTMLDivElement>;
  resizeButtonRef: React.RefObject<HTMLButtonElement>;
};

export function useResizeDrag({
  pos,
  size,
  setSize,
  setPos,
  minSize = 25,
  draggableRef,
  resizeButtonRef,
}: UseDraggableResizableProps) {
  const [isResizing, setIsResizing] = useState(false);

  const startMousePositionRef = useRef<Axis>({ x: 0, y: 0 });
  const startPositionRef = useRef<Axis>({ x: 0, y: 0 });
  const startSizeRef = useRef<Axis>({ x: 0, y: 0 });
  const parentElementRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback((onMove: (x: number, y: number) => void) => {
    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!parentElementRef.current) return;

      const pageX = "pageX" in e ? e.pageX : (e as TouchEvent).touches[0].pageX;
      const pageY = "pageY" in e ? e.pageY : (e as TouchEvent).touches[0].pageY;

      onMove(
        pageX - startMousePositionRef.current.x,
        pageY - startMousePositionRef.current.y
      );
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
  }, []);

  const handleDrag = useCallback(() => {
    if (isResizing) return;
    desactivateUserSelect();
    startPositionRef.current = pos;

    handleMove((dx, dy) => {
      const newPosX = startPositionRef.current.x + dx;
      const newPosY = startPositionRef.current.y + dy;

      const maxX = parentElementRef.current?.clientWidth! - size.x;
      const maxY = parentElementRef.current?.clientHeight! - size.y;

      console.log(maxX, maxY, parentElementRef.current?.clientWidth!, size.x)

      setPos({
        x: Math.max(0, Math.min(newPosX, maxX)),
        y: Math.max(0, Math.min(newPosY, maxY)),
      });
    });
  }, [isResizing, pos, setPos, size.x, size.y, handleMove]);

  const handleResize = useCallback(() => {
    setIsResizing(true);
    desactivateUserSelect();
    startSizeRef.current = size;

    handleMove((dx, dy) => {
      if (!parentElementRef.current) return;

      const newWidth = Math.max(
        minSize,
        Math.min(
          startSizeRef.current.x + dx,
          parentElementRef.current.clientWidth - pos.x
        )
      );
      const newHeight = Math.max(
        minSize,
        Math.min(
          startSizeRef.current.y + dy,
          parentElementRef.current.clientHeight - pos.y
        )
      );

      setSize({
        x: newWidth,
        y: newHeight,
      });
    });
  }, [minSize, pos.x, pos.y, setSize, size, handleMove]);

  useEffect(() => {
    const draggableElement = draggableRef.current;
    const resizeButtonElement = resizeButtonRef.current;

    if (!draggableElement || !resizeButtonElement) return;

    parentElementRef.current = draggableElement.parentElement as HTMLDivElement;

    const onMouseDown = (event: MouseEvent | TouchEvent) => {
      startMousePositionRef.current = {
        x:
          "pageX" in event
            ? event.pageX
            : (event as TouchEvent).touches[0].pageX,
        y:
          "pageY" in event
            ? event.pageY
            : (event as TouchEvent).touches[0].pageY,
      };

      handleDrag();
    };

    const onResizeMouseDown = (event: MouseEvent | TouchEvent) => {
      startMousePositionRef.current = {
        x:
          "pageX" in event
            ? event.pageX
            : (event as TouchEvent).touches[0].pageX,
        y:
          "pageY" in event
            ? event.pageY
            : (event as TouchEvent).touches[0].pageY,
      };

      handleResize();
    };

    resizeButtonElement.addEventListener("mousedown", onResizeMouseDown);
    resizeButtonElement.addEventListener("touchstart", onResizeMouseDown ,{ passive: true });
    draggableElement.addEventListener("mousedown", onMouseDown);
    draggableElement.addEventListener("touchstart", onMouseDown, { passive: true });

    return () => {
      draggableElement.removeEventListener("mousedown", onMouseDown);
      draggableElement.removeEventListener("touchstart", onMouseDown);
      resizeButtonElement.removeEventListener("mousedown", onResizeMouseDown);
      resizeButtonElement.removeEventListener("touchstart", onResizeMouseDown);
    };
  }, [draggableRef, resizeButtonRef, handleDrag, handleResize]);

  return {
    isResizing,
  };
}
