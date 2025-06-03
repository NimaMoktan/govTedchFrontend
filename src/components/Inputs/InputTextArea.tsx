import React from 'react';
import { useField } from 'formik';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface InputTextAreaProps {
  label: string;
  name: string;
  id?: string;
  [key: string]: any;
}

const InputTextArea = ({ label, ...props }: InputTextAreaProps) => {
  if (!props.name) {
    throw new Error("The 'name' prop is required for the Input component.");
  }
  const [field, meta] = useField(props);

  return (
    <>
      <Label
        className="mb-1.5 block text-sm font-medium"
        htmlFor={props.id || props.name}
      >
        {label}
      </Label>
      <Textarea
        id={props.id || props.name}
        {...field}
        {...props}
        className={`${
          meta.touched && meta.error ? 'rounded-md border border-red-500' : 'rounded-md border border-gray-300'} w-full p-2`}
        rows={4}
      />
      {meta.touched && meta.error ? (
        <span className="error text-red-500 text-xs ml-3">{meta.error}</span>
      ) : null}
    </>
  );
};

export default InputTextArea;