import { StyleBorderEnum, TextAlignEnum } from "../../lib/definitions";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Ban,
  Trash2,
  TypeOutline,
} from "lucide-react";
import { onKeyDownTextArea } from "../../lib/validation";
import { useEditImageContext } from "../../context/EditImageContext";
import CustomSelect from "../CustomSelect";

const fontFamilyList = [
  "Arial",
  "Comic Sans MS",
  "Georgia",
  "Impact",
  "Tahoma",
  "Times New Roman",
]

export default function TextEditor() {
  const { config, setTextBoxByIndex, setTextBoxes, setLastFocusIndex } =
    useEditImageContext();

  const lastFocusIndex = config.textBox.lastFocusIndex;
  const iconsList = [AlignLeft, AlignCenter, AlignRight];

  const handleDeleteTextBox = () => {
    if (lastFocusIndex === null) return;
    const boxes = config.textBox.boxes;
    const deleteIndex = lastFocusIndex;
    setLastFocusIndex(null);
    setTextBoxes(boxes.filter((_, index) => index !== deleteIndex));
  };

  if (lastFocusIndex === null) return null;
  const currentBox = config.textBox.boxes[lastFocusIndex];

  return (
    <div
      className={`flex flex-col gap-2 bg-slate-700 shadow-lg rounded p-3 relative 
        ${lastFocusIndex !== null ? "animate-slideDown" : "animate-slideUp"}`}
    >

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
                {fontFamilyList.map((value) => (
                  <option
                    style={{ fontFamily: value }}
                    key={value} 
                    value={value}
                  >
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-1 items-center">
              <input
                id="fontSize"
                name="fontSize"
                type="number"
                className="bg-slate-800 rounded outline-none p-1 w-16"
                value={currentBox.fontSize}
                onChange={(e) => {
                  const newValue = e.target.value.replace(/^0+/, '') || '0';
                  setTextBoxByIndex(lastFocusIndex, {
                    ...currentBox,
                    fontSize: Number(newValue),
                  })
                }}
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
