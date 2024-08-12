import { CirclePlus, Download, FlipHorizontal, LetterText, Upload } from "lucide-react";
import { useEditImageContext } from "../../context/EditImageContext";
import { defaultValuesTextBox } from "../../lib/definitions";
import { saveImage } from "../../lib/canva";

export default function ToolBar() {

  const { config, setTextBoxes, setFocusIndex, setScaleXImg, setLastFocusIndex } = useEditImageContext();

  const textBoxes = config.textBox.boxes;
  const scaleX = config.img.scaleX;
  const imageUrl = config.img.url;

  const handleAddTextBox = () => {
    setTextBoxes([...textBoxes, defaultValuesTextBox]);
    setFocusIndex(textBoxes.length);
    setLastFocusIndex(textBoxes.length);
  };

  return (
    <div className="flex justify-center gap-6 px-4">
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
        onClick={() => setScaleXImg(scaleX === 1 ? -1 : 1)}
        className={`relative text-white active:bg-slate-900 p-2 rounded ${scaleX === 1 ? "hover:bg-slate-600 bg-slate-700" : "bg-slate-900"}`}
        title="Flip Horizontal"
      >
        <FlipHorizontal size={32} />
      </button>
      <button
          onClick={() => saveImage(imageUrl, textBoxes, scaleX)}
          title="Download local"
          className="p-2 bg-green-600 text-white text-center hover:bg-green-700 rounded"
        >
        <Download size={32}/>
      </button>
      <button
          title="Publish post"
          className="p-2 bg-blue-600 text-white text-center hover:bg-blue-700 rounded"
        >
        <Upload size={32}/>
      </button>
      
    </div>
  );
}
