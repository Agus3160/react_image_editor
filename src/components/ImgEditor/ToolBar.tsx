import {
  CirclePlus,
  Download,
  FlipHorizontal,
  FlipVertical,
  LetterText,
  RectangleHorizontal,
  Upload,
} from "lucide-react";
import { useEditImageContext } from "../../context/EditImageContext";
import { defaultValuesTextBox, SpaceStyleEnum } from "../../lib/definitions";
import { saveImage } from "../../lib/canva";

export default function ToolBar() {
  const {
    config,
    setTextBoxes,
    setFocusIndex,
    setScaleXImg,
    setScaleYImg,
    setLastFocusIndex,
    setSpace,
  } = useEditImageContext();

  const textBoxes = config.textBox.boxes;
  const scale = { scaleX: config.img.scaleX, scaleY: config.img.scaleY };
  const space = config.space;

  const handleAddTextBox = () => {
    setTextBoxes([...textBoxes, defaultValuesTextBox]);
    setFocusIndex(textBoxes.length);
    setLastFocusIndex(textBoxes.length);
  };

  return (
    <div className="flex justify-around px-4">
      <button
        title="Add text box"
        onClick={handleAddTextBox}
        className="relative text-white active:bg-slate-900 hover:bg-slate-600 bg-slate-700 p-2 rounded"
      >
        <LetterText size={32} />
        <CirclePlus
          size={20}
          fill="#708090"
          className="absolute bottom-[-4px] right-[-4px]"
        />
      </button>
      <button
        onClick={() => setScaleXImg(scale.scaleX === 1 ? -1 : 1)}
        className={`relative text-white active:bg-slate-900 p-2 rounded ${
          scale.scaleX === 1
            ? "hover:bg-slate-600 bg-slate-700"
            : "bg-slate-800"
        }`}
        title="Flip Horizontal"
      >
        <FlipHorizontal size={32} />
      </button>
      <button
        onClick={() => setScaleYImg(scale.scaleY === 1 ? -1 : 1)}
        className={`relative text-white active:bg-slate-900 p-2 rounded ${
          scale.scaleY === 1
            ? "hover:bg-slate-600 bg-slate-700"
            : "bg-slate-800"
        }`}
        title="Flip Vertical"
      >
        <FlipVertical size={32} />
      </button>
      <button
        title="Add space"
        onClick={() =>
          setSpace(
            space.style === SpaceStyleEnum.none
              ? { ...space, style: SpaceStyleEnum.top, sizePercent: 0.2 }
              : { ...space, style: SpaceStyleEnum.none }
          )
        }
        className={`relative text-white active:bg-slate-900 p-2 rounded ${
          space.style === SpaceStyleEnum.none
            ? "hover:bg-slate-600 bg-slate-700"
            : "bg-slate-800"
        }`}
      >
        <RectangleHorizontal size={32} />
      </button>
      <button
        onClick={() => saveImage(config)}
        title="Download local"
        className="p-2 bg-green-600 text-white text-center hover:bg-green-700 rounded"
      >
        <Download size={32} />
      </button>
      <button
        title="Publish post"
        className="p-2 bg-blue-600 text-white text-center hover:bg-blue-700 rounded"
      >
        <Upload size={32} />
      </button>
    </div>
  );
}
