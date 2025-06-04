"use client";
import React, { useCallback, useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";

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
  searchable?: boolean; // New prop to toggle search
  searchPlaceholder?: string;
}

const SelectDropDown: React.FC<SelectDropDownProps> = ({
  label,
  options,
  onValueChange,
  name,
  id,
  searchable = false, // Default to false
  searchPlaceholder = "Search...",
}) => {
  const [field, meta, helpers] = useField(name);
  const { validateField } = useFormikContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm || !searchable) return options;
    return options.filter(option =>
      option.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, searchable]);

  // Debounce validation
  const debouncedValidate = useCallback(
    debounce((fieldName: string) => {
      validateField(fieldName);
    }, 100),
    [validateField]
  );

  const safeValue = field.value && typeof field.value === 'string' ? field.value : '';

  return (
    <div className="grid w-full items-center gap-1.5 mb-4">
      <Label htmlFor={id || name} className="text-sm font-medium">
        {label}
      </Label>
      <Select
        value={safeValue}
        onValueChange={(value) => {
          helpers.setValue(value);
          helpers.setTouched(true);
          debouncedValidate(name);
          onValueChange?.(value);
          setSearchTerm(""); // Clear search on selection
        }}
      >
        <SelectTrigger
          id={id || name}
          className={`w-full ${meta.touched && meta.error ? 'border-red-500' : ''}`}
        >
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className={inputFocused ? "pointer-events-none" : ""}>
          {/* Search Input - Conditionally rendered */}
          {searchable && (
            <div className="p-2 sticky top-0 bg-background z-10">
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setTimeout(() => setInputFocused(false), 100)}
                className="mb-2 focus-visible:ring-0"
                autoFocus={searchable}
              />
            </div>
          )}

          <SelectGroup>
            {filteredOptions?.length > 0 ? (
              filteredOptions.map((option) => (
                <SelectItem key={option.value} value={`${option.value}`}>
                  {option.text}
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                No options found
              </div>
            )}
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