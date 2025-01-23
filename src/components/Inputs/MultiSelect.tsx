import React, { useState, useEffect, useRef } from "react";
import { useField, FieldProps } from "formik";
// import { BiDownArrow, BiArrowFromTop } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";

interface Option {
  value: string;
  text: string;
}

interface MultiSelectProps {
  name: string;
  options: Option[];
  label?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ name, options, label }) => {
  const [field, , helpers] = useField(name);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<string[]>(field.value || []);
  const dropdownRef = useRef<any>(null);
  const triggerRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = ({ target }: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !triggerRef.current.contains(target)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = () => setShow(!show);

  const selectOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setSelected(newSelected);
    helpers.setValue(newSelected);
  };

  const removeOption = (value: string) => {
    const newSelected = selected.filter((v) => v !== value);
    setSelected(newSelected);
    helpers.setValue(newSelected);
  };

  return (
    <div className="relative z-50">
      {label && (
        <label
          htmlFor={name}
          className="mb-3 block text-sm font-medium text-black dark:text-white"
        >
          {label}
        </label>
      )}
      <div ref={triggerRef} onClick={toggleDropdown}>
        <div className="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input">
          <div className="flex flex-auto flex-wrap gap-3">
            {selected.length > 0 ? (
              selected.map((value) => {
                const option = options.find((opt) => opt.value === value);
                return (
                  <div
                    key={value}
                    className="flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                  >
                    <div className="max-w-full flex-initial">{option?.text}</div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(value);
                      }}
                      className="cursor-pointer pl-2 hover:text-danger"
                    >
                      ✕
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-1">
                <input
                  placeholder="Select an option"
                  className="h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                  disabled
                />
              </div>
            )}
          </div>
          <div className="flex w-8 items-center py-1 pl-1 pr-1">
            <button
              type="button"
              className="h-6 w-6 cursor-pointer outline-none focus:outline-none"
            >
              <IoIosArrowDown />
            </button>
          </div>
        </div>
      </div>
      {show && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full z-40 w-full max-h-40 overflow-y-auto rounded bg-white shadow dark:bg-form-input"
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`cursor-pointer px-4 py-2 hover:bg-primary/5 ${
                selected.includes(option.value) ? "bg-primary/10" : ""
              }`}
              onClick={() => selectOption(option.value)}
            >
              {option.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
