import { LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";

type TypeOptionsIcon = {
  value: string;
  icon: LucideIcon;
};

type Props = {
  optionsList: TypeOptionsIcon[];
  onChange: (value: string) => void;
  className?: string;
  classNameSelect?: string;
  classNameOptions?: string;
};

export default function CustomSelect({
  optionsList,
  className = "", 
  classNameSelect = "", 
  classNameOptions = "", 
  onChange
}: Props) {
  const [selectedOption, setSelectedOption] = useState<TypeOptionsIcon>(
    optionsList[0]
  );
  const [displayOptions, setDisplayOptions] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const SelectedIcon = selectedOption.icon;

  useEffect(() => {
    if (displayOptions) setShowOptions(true);
    else {
      const timer = setTimeout(() => setShowOptions(false), 300);
      return () => clearTimeout(timer);
    }
  }, [displayOptions]);

  useEffect(() => {
    onChange(selectedOption.value);
  }, [selectedOption]);

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-center gap-1 cursor-pointer ${classNameSelect}`}
        onClick={() => setDisplayOptions(!displayOptions)}
      >
        <SelectedIcon />
      </div>

      <div
        className={`absolute bottom-[calc(100%+4px)] flex flex-col gap-1 ${classNameSelect}  transition-opacity transition-transform duration-300 ease-out ${
          displayOptions
            ? "translate-y-100 opacity-100"
            : "translate-y-0 opacity-0"
        } transform origin-top`}
        style={{ transformOrigin: "top" }}
      >
        {showOptions &&
          optionsList.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.value}
                onClick={() => {
                  setSelectedOption(option);
                  setDisplayOptions(false);
                }}
                className={`flex items-center gap-1 cursor-pointer ${classNameOptions} ${classNameSelect}`}
              >
                <Icon />
                <span>{option.value}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
