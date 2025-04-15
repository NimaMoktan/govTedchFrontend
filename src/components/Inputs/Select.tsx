"use client";
import React from "react";
import { useField } from "formik";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select";

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
  return (
    <div className="grid w-full items-center gap-1.5 mb-4">
      <Label htmlFor={id || name} className="text-sm font-medium">
        {label}
      </Label>
      <Select
        value={field.value}
        onValueChange={(value) => {
          helpers.setValue(value);
          onValueChange?.(value);
        }}
      >
        <SelectTrigger id={id || name} className="w-full">
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
      {meta.touched && meta.error && (
        <p className="text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
};

export default SelectDropDown;