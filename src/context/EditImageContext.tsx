import { createContext, useContext, useState, ReactNode } from "react";
import { SpaceImgConfigType, SpaceStyleEnum, TextBox, defaultValuesTextBox } from "../lib/definitions";

export type EditImageConfig = {
  img: {
    url: string;
    scaleX: number;
    scaleY: number;
  };
  textBox: {
    boxes: TextBox[];
    focusIndex: number | null;
    lastFocusIndex: number | null;
  };
  space:SpaceImgConfigType
};

export type EditImageContextType = {
  config: EditImageConfig;
  setConfig: React.Dispatch<React.SetStateAction<EditImageConfig>>;

  setTextBoxes: (newTextBoxes: TextBox[]) => void;
  setFocusIndex: (index: number | null) => void;
  setLastFocusIndex: (index: number | null) => void;
  setTextBoxByIndex: (index: number, newTextBox: TextBox) => void;
  setScaleXImg: (scaleX: number) => void;
  setScaleYImg: (scaleY: number) => void;
  setSpace: ({style, sizePercent, color}: {style: SpaceStyleEnum, sizePercent: number, color: string}) => void;
};

export const EditImageContext = createContext<EditImageContextType | null>(
  null
);

export const EditImageProvider = ({
  children,
  imageUrl,
}: {
  children: ReactNode;
  imageUrl?: string;
}) => {
  const defaultValues: EditImageConfig = {
    img: {
      url: imageUrl || "",
      scaleX: 1,
      scaleY: 1,
    },
    textBox: {
      boxes: [defaultValuesTextBox],
      focusIndex: 0,
      lastFocusIndex: 0,
    },
    space: {
      style: SpaceStyleEnum.none,
      sizePercent: 0.2,
      color: "#ffffff",
    },
  };

  const [editImageContext, setEditImageContext] = useState<EditImageConfig>(defaultValues);

  const setTextBoxes = (newTextBoxes: TextBox[]) => {
    setEditImageContext((prev) => ({ ...prev, textBox: {...prev.textBox, boxes: newTextBoxes} }));
  };

  const setTextBoxByIndex = (index: number, newTextBox: TextBox) => {
    setEditImageContext((prev) => { 
      const newTextBoxes = prev.textBox.boxes;
      newTextBoxes[index] = newTextBox;
      return ({
      ...prev,
      textBox:{
        ...prev.textBox,
        boxes: newTextBoxes
      }
    })});
  };

  const setFocusIndex = (index: number | null) => {
    setEditImageContext((prev) => ({
      ...prev,
      textBox: { ...prev.textBox, focusIndex: index },
    }));
  };

  const setLastFocusIndex = (index: number | null) => {
    setEditImageContext((prev) => ({
      ...prev,
      textBox: { ...prev.textBox, lastFocusIndex: index },
    }));
  };

  const setScaleXImg = (scaleX: number) => {
    setEditImageContext((prev) => ({
      ...prev,
      img: { ...prev.img, scaleX },
    }));
  }
  const setScaleYImg = (scaleY: number) => {
    setEditImageContext((prev) => ({
      ...prev,
      img: { ...prev.img, scaleY },
    }));
  }

  const setSpace = ({style, sizePercent, color}: {style: SpaceStyleEnum, sizePercent: number, color: string}) => {
    console.log(style, sizePercent, color)
    setEditImageContext((prev) => ({
      ...prev,
      space: { ...prev.space, style, sizePercent, color },
    }));
  }

  return (
    <EditImageContext.Provider
      value={{
        config: editImageContext,
        setConfig: setEditImageContext,
        setTextBoxes,
        setFocusIndex,
        setLastFocusIndex,
        setTextBoxByIndex,
        setScaleXImg,
        setScaleYImg,
        setSpace
      }}
    >
      {children}
    </EditImageContext.Provider>
  );
};

export const useEditImageContext = (): EditImageContextType => {
  const context = useContext(EditImageContext);
  if (!context) {
    throw new Error(
      "useEditImageContext must be used within an EditImageProvider"
    );
  }
  return context;
};
