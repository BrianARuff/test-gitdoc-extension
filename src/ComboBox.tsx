import {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

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
  const listboxRef = useRef<HTMLDivElement>(null);
  const comboWrapperRef = useRef<HTMLDivElement>(null);
  const comboboxRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<{
    value: string;
    label: string;
    index: number;
  }>(options?.[0] || {});
  const [selectedOption, setSelectedOption] = useState<ComboxBoxOption | null>(
    null
  );
  const [transform, setTransform] = useState<string>("");

  const uid = useId();
  const comboboxId = `combobox__${uid}`;
  const comboboxLabelId = `comboboxLabel__${uid}`;

  const portalRootElement = document.querySelector(
    "#__portal__"
  ) as HTMLElement;

  // Updates transform position state
  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && comboboxRef.current && listboxRef.current) {
        const buttonRect = comboboxRef.current.getBoundingClientRect();
        const listboxRect = listboxRef.current.getBoundingClientRect();

        const translateY = buttonRect?.y + buttonRect.height + 8;
        const translateX =
          buttonRect?.x + buttonRect?.width / 2 - listboxRect?.width / 2;

        setTransform(`translate(${translateX}px, ${translateY}px)`);
      }
    };

    if (isOpen && comboboxRef.current && listboxRef.current) {
      updatePosition();
    }

    window.addEventListener("resize", updatePosition);
    window.addEventListener("keydown", updatePosition);
    window.addEventListener("pointermove", updatePosition);
    window.addEventListener("mousemove", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // Closes menu if click is not inside of combo box wrapper div.
  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (
        comboWrapperRef?.current &&
        e.target instanceof Node &&
        !comboWrapperRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    console.log("selectedOption value is => ", selectedOption);
  }, [selectedOption]);

  const handleSelect = (option: ComboxBoxOption) => {
    setIsOpen(false);
    setSelectedOption(option);
  };

  const handleOnPointerDown = () => {
    setIsOpen((prev) => !prev);
  };

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
          key={`${optionId}Key`}
          aria-selected={false}
          onClick={() => {
            handleSelect(option);
          }}
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
    <div ref={comboWrapperRef} className="combobox-wrapper">
      <label htmlFor={comboboxId} className={"combobox-label"}>
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
        onPointerDown={handleOnPointerDown}
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
      {createPortal(
        <div
          tabIndex={-1}
          role="listbox"
          ref={listboxRef}
          id={`comboboxListbox__${uid}`}
          aria-labelledby={comboboxLabelId}
          className={
            isOpen && transform
              ? "show combobox-listbox"
              : "hide combobox-listbox"
          }
          style={{
            top: "0",
            left: "0",
            transform,
            minWidth: "200px",
          }}
        >
          <RenderListOptions />
        </div>,
        portalRootElement!
      )}
    </div>
  );
};
