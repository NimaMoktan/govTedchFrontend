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

const SelectDropDown = ({ label, options, ...props }) => {
    if (!props.name) {
        throw new Error("The 'name' prop is required for the SelectDropDown component.");
    }

    const [field, meta, helpers] = useField(props);

    return (
        <div>
            <Label
                className="mb-3 block text-sm font-medium"
                htmlFor={props.id || props.name}
            >
                {label}
            </Label>
            <Select
                id={props.id || props.name}
                value={field.value || undefined} // default to undefined
                onValueChange={(value) => helpers.setValue(value)}
                aria-invalid={meta.touched && meta.error ? "true" : "false"}
                aria-labelledby={props.id || props.name}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {options?.map((option, index) => (
                            <SelectItem key={index} value={option.value}>
                                {option.text}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            {meta.touched && meta.error ? (
                <div className="mt-1 text-sm text-red-500">{meta.error}</div>
            ) : null}
        </div>
    );
};

export default SelectDropDown;
