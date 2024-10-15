import {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";

export type ComboxBoxOption = {
  label: string;
  value: string;
  index: number;
  isSelected?: boolean;
};

export type RenderLabelSpanProps = {
  comboboxRef?: RefObject<HTMLDivElement>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selected: ComboxBoxOption;
  setSelected: Dispatch<SetStateAction<ComboxBoxOption>>;
};

export type RenderListOptionProps = {
  comboboxRef?: RefObject<HTMLDivElement>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selected: ComboxBoxOption;
  setSelected: Dispatch<SetStateAction<ComboxBoxOption>>;
  option: ComboxBoxOption;
};

export type ComboboxProps = {
  options?: ComboxBoxOption[];
  renderLabelSpan?: (props: RenderLabelSpanProps) => ReactNode;
  renderListOption?: (props: RenderListOptionProps) => ReactNode;
};

export const Combobox = ({
  renderLabelSpan,
  renderListOption,
  options = [],
}: ComboboxProps) => {
  const comboboxRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<{
    value: string;
    label: string;
    index: number;
  }>(options?.[0] || {});

  const uid = useId();
  const comboboxId = `combobox__${uid}`;
  const comboboxLabelId = `comboboxLabel__${uid}`;

  const RenderLabelSpan = useCallback(
    () =>
      renderLabelSpan?.({
        comboboxRef,
        isOpen,
        selected,
        setIsOpen,
        setSelected,
      }),
    [isOpen, selected, setIsOpen, setSelected, renderLabelSpan]
  );

  const RenderListOptions = useCallback(() => {
    const optionsRenderContent = options?.map((option, index) => {
      const optionId = `comboboxOption__${index}`;

      return (
        <div
          className="combobox-option-container"
          role="option"
          id={optionId}
          key={optionId}
          aria-selected={false}
        >
          {renderListOption?.({
            comboboxRef,
            isOpen,
            selected,
            setIsOpen,
            setSelected,
            option,
          })}
        </div>
      );
    });

    return optionsRenderContent;
  }, [isOpen, selected, options, setIsOpen, setSelected, renderListOption]);

  return (
    <div className="combobox-wrapper">
      <label htmlFor={comboboxId} className={"combobox-label"}>
        <span>Hello Test Save Commit GitDoc</span>
        <RenderLabelSpan />
      </label>
      <div
        ref={comboboxRef}
        id={comboboxId}
        aria-controls={comboboxId}
        aria-expanded={isOpen}
        aria-haspopup={"listbox"}
        aria-labelledby={comboboxLabelId}
        role="combobox"
        className="combobox-container"
        tabIndex={0}
        onPointerDown={() => {
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" ||
            e.key === " " ||
            e.key === "ArrowDown" ||
            e.key === "ArrowUp"
          ) {
            setIsOpen((prev) => !prev);
          }
        }}
      />
      <div
        id={`comboboxListbox__${uid}`}
        tabIndex={-1}
        role="listbox"
        aria-labelledby={comboboxLabelId}
        className={
          isOpen
            ? "show combobox-listbox-container"
            : "hide combobox-listbox-container"
        }
      >
        <RenderListOptions />
      </div>
    </div>
  );
};
