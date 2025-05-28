"use client";
import React, { useCallback } from "react";
import { useField, useFormikContext } from "formik";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
// import debounce from "lodash.debounce";

interface Option {
  value: any;
  text: string;
}

interface SelectDropDownProps {
  label: string;
  options: Option[];
  name: string;
  id?: string;
  onValueChange?: (value: string) => void;
}

const SelectDropDown: React.FC<SelectDropDownProps> = ({
  label,
  options,
  onValueChange,
  name,
  id,
}) => {
  const [field, meta, helpers] = useField(name);
  // const { validateField } = useFormikContext();

  // Debounce validation to avoid rapid state changes
  // const debouncedValidate = debounce((fieldName: string) => {
  //   validateField(fieldName);
  // }, 100);

  return (
    <div className="grid w-full items-center gap-1.5 mb-4">
      <Label htmlFor={id || name} className="text-sm font-medium">
        {label}
      </Label>
      <Select
        value={field.value}
        onValueChange={(value) => {
          helpers.setValue(value);
          helpers.setTouched(true);
          // debouncedValidate(name); // Validate with debounce
          onValueChange?.(value);
        }}
      >
        <SelectTrigger
          id={id || name}
          className={`w-full ${meta.touched && meta.error ? 'border-red-500' : ''}`}
        >
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options?.map((option) => (
              <SelectItem key={option.value} value={`${option?.value}`}>
                {option?.text}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {meta.touched && meta.error ? (
        <span className="text-red-500 text-xs ml-3">{meta.error}</span>
      ) : null}
    </div>
  );
};

export default SelectDropDown;