import { StyleBorderEnum, TextAlignEnum } from "../../lib/definitions";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Ban,
  Trash2,
  TypeOutline,
  X,
} from "lucide-react";
import { onKeyDownTextArea } from "../../lib/validation";
import { useEditImageContext } from "../../context/EditImageContext";
import CustomSelect from "../CustomSelect";

export default function TextEditor() {
  const { config, setTextBoxByIndex, setTextBoxes, setLastFocusIndex } =
    useEditImageContext();

  const lastFocusIndex = config.textBox.lastFocusIndex;
  const quantityOfBoxes = config.textBox.boxes.length;
  const iconsList = [AlignLeft, AlignCenter, AlignRight];

  const handleCloseTextBox = () => {
    setLastFocusIndex(null);
  };

  const handleDeleteTextBox = () => {
    if (!lastFocusIndex) return;
    const boxes = config.textBox.boxes;
    setTextBoxes(boxes.filter((_, index) => index !== lastFocusIndex));
    setLastFocusIndex(quantityOfBoxes - 1 === 0 ? null : lastFocusIndex - 1);
  };

  if (lastFocusIndex === null) return null;
  const currentBox = config.textBox.boxes[lastFocusIndex];

  return (
    <div
      className={`flex flex-col gap-2 bg-slate-700 shadow-lg rounded p-3 relative 
        ${lastFocusIndex !== null ? "animate-slideDown" : "animate-slideUp"}`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{`Text #${lastFocusIndex + 1}`}</h2>
        <button className="hover:text-red-500" onClick={handleCloseTextBox}>
          <X />
        </button>
      </div>

      <div className="flex gap-2 flex-wrap flex-1 items-center">
        <div className="flex w-full gap-1 items-center">
          <textarea
            className="bg-slate-800 rounded outline-none text-sm flex-1 p-1 resize-none"
            placeholder="Enter text here..."
            onKeyDown={onKeyDownTextArea}
            rows={2}
            value={currentBox.text}
            onChange={(e) =>
              setTextBoxByIndex(lastFocusIndex, {
                ...currentBox,
                text: e.target.value,
              })
            }
          ></textarea>

          <input
            id="color"
            name="color"
            type="color"
            className="bg-transparent w-8 h-8 rounded outline-none"
            value={currentBox.color}
            onChange={(e) =>
              setTextBoxByIndex(lastFocusIndex, {
                ...currentBox,
                color: e.target.value,
              })
            }
          ></input>

          <div className="relative">
            {currentBox.styleBorder === StyleBorderEnum.none && (
              <Ban size={20} className="absolute top-[6px] right-[6px] " />
            )}
            <input
              id="shadow-color"
              name="shadow-color"
              type="color"
              disabled={currentBox.styleBorder === StyleBorderEnum.none}
              className="bg-transparent w-8 h-8  rounded outline-none"
              value={currentBox.borderColor}
              onChange={(e) =>
                setTextBoxByIndex(lastFocusIndex, {
                  ...currentBox,
                  borderColor: e.target.value,
                })
              }
            ></input>
          </div>
        </div>

        <div className="flex gap-1 flex-1 flex-col ">
          <div className="flex gap-1">
            <div className="flex gap-1 items-center ">
              <select
                className="bg-slate-800 flex-1 p-1 rounded outline-none"
                id="fontFamily"
                name="fontFamily"
                value={currentBox.fontFamily}
                onChange={(e) =>
                  setTextBoxByIndex(lastFocusIndex, {
                    ...currentBox,
                    fontFamily: e.target.value,
                  })
                }
              >
                <option value="Arial">Arial</option>
                <option value="Roboto">Roboto</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
                <option value="Impact">Impact</option>
              </select>
            </div>

            <div className="flex gap-1  items-center">
              <input
                id="fontSize"
                name="fontSize"
                type="number"
                className="bg-slate-800 rounded outline-none p-1 w-16"
                value={currentBox.fontSize}
                onChange={(e) =>
                  setTextBoxByIndex(lastFocusIndex, {
                    ...currentBox,
                    fontSize: Number(e.target.value),
                  })
                }
              ></input>
            </div>

            <CustomSelect
              classNameSelect="bg-slate-800 p-1 rounded outline-none "
              classNameOptions="hover:bg-slate-600"
              onChange={(v) =>
                setTextBoxByIndex(lastFocusIndex, {
                  ...currentBox,
                  textAlign: v as TextAlignEnum,
                })
              }
              optionsList={Object.values(TextAlignEnum).map((value, index) => ({
                value,
                icon: iconsList[index],
              }))}
            />

            <button
              title="Set border"
              className={`${
                currentBox.styleBorder === StyleBorderEnum.solid
                  ? "bg-slate-900"
                  : "bg-slate-800 "
              } p-1 rounded outline-none`}
              onClick={() =>
                setTextBoxByIndex(lastFocusIndex, {
                  ...currentBox,
                  styleBorder:
                    currentBox.styleBorder === StyleBorderEnum.none
                      ? StyleBorderEnum.solid
                      : StyleBorderEnum.none,
                })
              }
            >
              <TypeOutline />
            </button>
          </div>
        </div>
      </div>
      <button
        title="Delete text box"
        className="hover:bg-red-500 absolute top-[-10px] left-[-10px] shadow-md bg-gray-600 outline-1 outline outline-white  text-white active:bg-red-900 p-1 rounded-full"
        onClick={handleDeleteTextBox}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
