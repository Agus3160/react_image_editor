
import Preview from "./Preview";
import TextEditor from "./TextEditor";
import ToolBar from "./ToolBar";
import { Image } from "lucide-react";

type Props = {};

export default function ImageEditor({}: Props) {

  return (
    <div className="flex flex-col md:flex-row rounded py-4 gap-4 items-center">
      <div className="flex flex-col gap-4">
        <div className="flex justify-center  items-center gap-2">
          <Image size={32} />
          <h1 className="text-3xl font-bold text-center">Preview</h1>
        </div>
        <Preview />
        <ToolBar />
      </div>
      <div className="flex flex-col gap-4 max-w-[320px]">
        <TextEditor />  
      </div>
    </div>
  );
}
