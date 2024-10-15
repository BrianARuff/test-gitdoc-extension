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
  const [selected, setSelected] = useState<ComboxBoxOption>(options[0] || {});
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [listboxRect, setListboxRect] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

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

        const y = buttonRect?.y + buttonRect.height + 8;
        const x =
          buttonRect?.x + buttonRect?.width / 2 - listboxRect?.width / 2;
        setListboxRect({
          x,
          y,
        });
      }
    };

    if (isOpen && comboboxRef.current && listboxRef.current) {
      updatePosition();
    }

    window.addEventListener("resize", updatePosition);
    window.addEventListener("keydown", updatePosition);
    window.addEventListener("pointermove", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("keydown", updatePosition);
      window.removeEventListener("pointermove", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isOpen]);

  // Closes menu if click is not inside of combo box wrapper div.
  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (
        comboWrapperRef?.current &&
        e.target instanceof Node &&
        !comboWrapperRef.current.contains(e.target) &&
        portalRootElement?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, portalRootElement]);

  const handleSelect = (option: ComboxBoxOption) => {
    setIsOpen(false);
    setSelected(option);
    setFocusedIndex(option.index);
  };

  const handleOnPointerDown = () => {
    setIsOpen((prev) => !prev);
  };

  const scrollIntoView = (index: number) => {
    const element = document.getElementById(`comboboxOption__${index}`);
    if (element) {
      element.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      (e.key === "Enter" ||
        e.key === " " ||
        e.key === "ArrowDown" ||
        e.key === "ArrowUp") &&
      !e.altKey
    ) {
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(0);
        e.preventDefault();
      } else {
        if (e.key === "Enter" || e.key === " ") {
          if (focusedIndex >= 0) {
            handleSelect(options[focusedIndex]);
          }
          setIsOpen(false);
          e.preventDefault();
        } else if (e.key === "ArrowDown") {
          setFocusedIndex((prevIndex) => {
            const newIndex =
              prevIndex < options.length - 1 ? prevIndex + 1 : prevIndex;
            scrollIntoView(newIndex);
            return newIndex;
          });
          e.preventDefault();
        } else if (e.key === "ArrowUp") {
          setFocusedIndex((prevIndex) => {
            const newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex;
            scrollIntoView(newIndex);
            return newIndex;
          });
          e.preventDefault();
        }
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      e.preventDefault();
    } else if (e.key === "ArrowUp" && e.altKey) {
      if (focusedIndex >= 0) {
        handleSelect(options[focusedIndex]);
      }
      setIsOpen(false);
      e.preventDefault();
    }
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
          className={`combobox-option-container ${
            focusedIndex === index ? "focused" : ""
          } ${selected.value === option.value ? "selected" : ""}`}
          role="option"
          id={optionId}
          key={`${optionId}Key`}
          aria-selected={selected.value === option.value}
          onClick={() => {
            handleSelect(option);
          }}
          tabIndex={-1}
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
  }, [
    isOpen,
    selected,
    options,
    setIsOpen,
    setSelected,
    renderListOption,
    focusedIndex,
  ]);

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
        onBlur={() => {
          if (isOpen) {
            setIsOpen(false);
          }
        }}
        onKeyDown={handleKeyDown}
      >
        <span className="comobox-container-selected">{selected?.label}</span>
      </div>
      {createPortal(
        <div
          tabIndex={-1}
          role="listbox"
          ref={listboxRef}
          id={`comboboxListbox__${uid}`}
          aria-labelledby={comboboxLabelId}
          className={isOpen ? "show combobox-listbox" : "hide combobox-listbox"}
          style={{
            top: listboxRect.y + "px",
            left: listboxRect.x + "px",
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
