import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";
import { useField } from "formik";
import { FaRegCalendarAlt  } from "react-icons/fa";

interface DatePickerProps {
  name: string;
  label: string;
  mode?: "single" | "multiple" | "range";
  dateFormat?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  mode = "single",
  dateFormat = "Y-m-d",
    ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [field, meta, helpers] = useField(props);
  if (!props.name) {
          throw new Error("The 'name' prop is required for the Input component.");
      }
  

  useEffect(() => {
    if (inputRef.current) {
      flatpickr(inputRef.current, {
        mode,
        // dateFormat,
        dateFormat: "M j, Y",
        static: true,
        monthSelectorType: "static",
        position: "auto",
        prevArrow:
          '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow:
          '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
        onChange: (selectedDates) => {
          const formattedDates =
            mode === "range"
              ? selectedDates.map((date) => date.toISOString())
              : selectedDates[0]?.toISOString();
          helpers.setValue(formattedDates);
        },
      });
    }
  }, [inputRef, mode, dateFormat, helpers]);

  

  return (
    <div>
      <label
        htmlFor={props.name}
        className="mb-3 block text-sm font-medium text-black dark:text-white"
      >
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={props.name}
          className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          {...field}
        />
        <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
          <FaRegCalendarAlt  className="text-primary" size={18} />
        </div>
      </div>
      {meta.touched && meta.error ? (
                <div className="error text-red-500">{meta.error}</div>
            ) : null}
    </div>
  );
};

export default DatePicker;
