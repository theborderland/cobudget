import { ComponentType } from "react";
import Wysiwyg from "./Wysiwyg";

const TextField = ({
  inputRef,
  inputProps,
  name,
  placeholder,
  label,
  labelComponent,
  defaultValue,
  error,
  helperText,
  className,
  multiline,
  onChange,
  rows,
  size,
  autoFocus,
  maxLength,
  required,
  startAdornment,
  endAdornment,
  color = "anthracit",
  wysiwyg,
  enableMentions = false,
  mentionsCollId = null,
  testid,
}: {
  inputRef?: any;
  inputProps?: any;
  name?: string;
  placeholder?: string;
  label?: string;
  labelComponent?: ComponentType;
  defaultValue?: string;
  error?: boolean;
  helperText?: string;
  className?: string;
  multiline?: boolean;
  onChange?: (e: any) => void;
  rows?: number;
  size?: string;
  autoFocus?: boolean;
  maxLength?: number;
  required?: boolean;
  startAdornment?: string;
  endAdornment?: string;
  color?: string;
  wysiwyg?: boolean;
  enableMentions?: boolean;
  mentionsCollId?: string;
  testid?: string;
}) => {
  const LabelComponent = labelComponent;
  return (
    <div
      className={`flex flex-col min-w-0 ${className}`}
      data-testid={testid ? `text-field-container-${testid}` : ""}
    >
      {(label || labelComponent) && (
        <label htmlFor={name} className="text-sm font-medium mb-1 block">
          {label ? label : <LabelComponent />}
        </label>
      )}
      {multiline || wysiwyg ? (
        wysiwyg ? (
          <Wysiwyg
            inputRef={inputRef}
            placeholder={placeholder}
            autoFocus={autoFocus}
            defaultValue={defaultValue}
            rows={multiline ? rows : 1}
            onChange={onChange ?? inputProps?.onChange}
            highlightColor={color}
            enableMentions={enableMentions}
            mentionsCollId={mentionsCollId}
          />
        ) : (
          <textarea
            className={`block  px-4 py-3 rounded-md  bg-gray-100 focus:bg-white focus:outline-none border-3 ${
              error ? "border-red" : `border-transparent focus:border-${color}`
            } transition-colors ease-in-out duration-200`}
            name={name}
            id={name}
            ref={inputRef}
            placeholder={placeholder}
            defaultValue={defaultValue}
            rows={rows}
            autoFocus={autoFocus}
            maxLength={maxLength}
            required={required}
            data-testid={testid}
            {...inputProps}
          />
        )
      ) : (
        <div
          className={`relative flex rounded-md border-3 transition-colors ease-in-out duration-200 
            bg-gray-100 focus-within:bg-white 
            ${
              error
                ? "border-red"
                : `border-transparent focus-within:border-${color}`
            }
          `}
        >
          {startAdornment && (
            <label
              htmlFor={name}
              className="ml-4 flex items-center text-gray-500"
            >
              {startAdornment}
            </label>
          )}
          <input
            className={`block w-full px-4 py-3 focus:outline-none transition-colors ease-in-out duration-200 bg-transparent
              ${size === "large" ? "text-xl" : ""}
              ${startAdornment ? "pl-1" : ""}
              ${endAdornment ? "pr-1" : ""}
            `}
            data-testid={testid}
            name={name}
            id={name}
            ref={inputRef}
            placeholder={placeholder}
            defaultValue={defaultValue}
            autoFocus={autoFocus}
            {...inputProps}
            onFocus={(e) => {
              inputProps?.onFocus?.(e);
            }}
            onBlur={(e) => {
              inputProps?.onBlur?.(e);
            }}
          />
          {endAdornment && (
            <label
              htmlFor={name}
              className="mr-4 flex items-center text-gray-500"
            >
              {endAdornment}
            </label>
          )}
        </div>
      )}
      {error && helperText && (
        <span
          className="text-red px-4 py-1 text-xs font-medium"
          data-testid={testid ? `helpertext-${testid}` : undefined}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};

export default TextField;
