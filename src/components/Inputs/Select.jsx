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
} from "@/components/ui/select"

const SelectDropDown = ({ label, ...props }) => {
    if (!props.name) {
        throw new Error("The 'name' prop is required for the SelectMultiple component.");
    }

    const [field, meta] = useField(props);

    return (
        <>
            <Label
                className="mb-3 block text-sm font-medium"
                htmlFor={props.id || props.name}
            >
                {label}
            </Label>
            <Select
                id={props.id || props.name}
                {...field}
                {...props}
            >
                <SelectTrigger>
                    <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {props.options?.map((option, index) => (
                            <SelectItem key={index} value={option.value}>
                                {option.text}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            {meta.touched && meta.error ? (
                <div className="error text-red-500">{meta.error}</div>
            ) : null}
        </>
    );
};

export default SelectDropDown;
