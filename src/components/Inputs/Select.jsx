"use client";
import React from "react";
import { useField } from "formik";

const Select = ({ label, ...props }) => {
    if (!props.name) {
        throw new Error("The 'name' prop is required for the SelectMultiple component.");
    }

    const [field, meta] = useField(props);

    return (
        <>
            <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor={props.id || props.name}
            >
                {label}
            </label>
            <select
            id={props.id || props.name}
                {...field}
                {...props}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
                {props.options?.map((option, index) => (
                    <option key={index} value={option.value} className="text-body dark:text-bodydark">
                        {option.text}
                    </option>
                ))}
            </select>
            {meta.touched && meta.error ? (
                <div className="error text-red-500">{meta.error}</div>
            ) : null}
        </>
    );
};

export default Select;
