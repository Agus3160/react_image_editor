import { useRef, useState } from "react";
import { useEditImageContext } from "../../context/EditImageContext";
import { SpaceStyleEnum } from "../../lib/definitions";

export default function SpaceEditor() {
  const { config, setSpace } = useEditImageContext();

  const currentSpaceConfig = config.space;

  const displayEditor = currentSpaceConfig.style !== SpaceStyleEnum.none;

  const [spaceConfig, setSpaceConfig] = useState({
    ...currentSpaceConfig,
    style: SpaceStyleEnum.top,
  });
  const percentageValueRef = useRef<HTMLInputElement>(null);

  if (!displayEditor) return null;

  const selectStyleOptions = Object.keys(SpaceStyleEnum).filter((style) => {
    if (style !== SpaceStyleEnum.none) return style;
  });

  return (
    <div
      className={`flex flex-col w-full items-center relative 
      ${displayEditor ? "animate-slideDown" : "animate-slideUp"}`}
    >
      <div className="flex gap-2 items-center justify-center w-full">
        <input
          type="color"
          defaultValue={currentSpaceConfig.color}
          onChange={(e) => {
            setSpaceConfig({ ...spaceConfig, color: e.target.value });
          }}
          className=" outline-none border-none rounded"
        ></input>

        <select
          className="bg-slate-700 p-1 rounded outline-none border-none"
          onChange={(e) => {
            setSpaceConfig({
              ...spaceConfig,
              style: e.target.value as SpaceStyleEnum,
            });
          }}
        >
          {selectStyleOptions.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>

        <div className="flex">
          <span className="bg-slate-800 text-sm p-1 rounded">
            {((percentageValueRef.current?.value as unknown as number) ||
              currentSpaceConfig.sizePercent) * 100}
            %
          </span>
          <input
            type="range"
            defaultValue={currentSpaceConfig.sizePercent}
            min={0.1}
            max={1}
            step={0.1}
            ref={percentageValueRef}
            onChange={(e) =>
              setSpaceConfig({
                ...spaceConfig,
                sizePercent: Number(e.target.value),
              })
            }
            className="w-24"
          ></input>
        </div>
        <button
          className="px-2 py-1 rounded hover:bg-slate-700 bg-slate-600 shadow"
          type="button"
          onClick={() => {
            console.log(spaceConfig);
            setSpace(spaceConfig);
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
