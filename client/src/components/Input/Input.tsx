import { useState, type ComponentPropsWithRef } from 'react';
import { cn } from '../../utils/cn';

type InputProps = ComponentPropsWithRef<'input'> & {
  className?: string;
};

export const Input = ({
  className,
  value: externalValue,
  defaultValue,
  onChange,
  ...props
}: InputProps) => {
  const [value, setValue] = useState(externalValue ?? defaultValue);

  return (
    <input
      className={cn(
        'w-full p-3 border text-sm border-input-primary rounded-md focus:outline-none focus:ring-2 focus:border-input-focus',
        className
      )}
      onChange={(e) => {
        setValue(e.target.value);
        onChange?.(e);
      }}
      value={value}
      {...props}
    />
  );
};

Input.displayName = 'Input';
