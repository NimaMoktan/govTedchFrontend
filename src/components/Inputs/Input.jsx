import React from 'react';
import { useField } from 'formik';

const Input = ({ label, ...props }) => {
    if (!props.name) {
        throw new Error("The 'name' prop is required for the Input component.");
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
            <input
                id={props.id || props.name}
                {...field}
                {...props}
                className="w-full rounded rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {meta.touched && meta.error ? (
                <div className="error text-red-500">{meta.error}</div>
            ) : null}
        </>
    );
};

export default Input;
