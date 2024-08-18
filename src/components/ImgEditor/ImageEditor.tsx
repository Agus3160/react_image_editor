import Preview from "./Preview";
import SpaceEditor from "./SpaceEditor";
import TextEditor from "./TextEditor";
import ToolBar from "./ToolBar";

type Props = {};

export default function ImageEditor({}: Props) {
  return (
    <div className="flex px-0 flex-col h-dvh md:px-2 md:flex-row rounded w-full gap-4 items-center justify-center">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center flex-col-reverse  ">
          <ToolBar />
          <Preview />
        </div>
        <SpaceEditor />
      </div>
      <div className="max-w-[320px]">
        <TextEditor />
      </div>  
    </div>
  );
}
