import {
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  TextField,
} from "@mui/material";
import { type ReactNode } from "react";

export interface AppSelectProps<T> {
  options: T[];
  /**
   * The value of the select.
   * - If `multiple` is true, this should be an array of values (IDs/primitives).
   * - If `multiple` is false, this should be a single value (ID/primitive).
   *
   * Note: This component expects the *value* of the option (e.g. ID), not the option object itself,
   * even in Autocomplete mode, to maintain consistency.
   */
  value: any;
  onChange: (value: any) => void;
  label?: string;
  placeholder?: string;
  isAutocomplete?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: ReactNode;
  name?: string;
  fullWidth?: boolean;
  required?: boolean;
  className?: string;

  /**
   * Function to extract the label to display for an option.
   * Defaults to `option.label` or `option` itself.
   */
  getOptionLabel?: (option: T) => string;
  /**
   * Function to extract the underlying value/ID of an option.
   * Defaults to `option.value` or `option` itself.
   */
  getOptionValue?: (option: T) => any;
}

export default function AppSelect<T = any>({
  options,
  value,
  onChange,
  label,
  placeholder,
  isAutocomplete = false,
  multiple = false,
  disabled = false,
  error = false,
  helperText,
  name,
  fullWidth = false,
  required = false,
  getOptionLabel = (option: any) => option?.label ?? String(option),
  getOptionValue = (option: any) => option?.value ?? option,
  className,
  ...props
}: AppSelectProps<T>) {
  // --- Select Handler ---
  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    const newVal = event.target.value;
    onChange(newVal);
  };

  // --- Autocomplete Handler ---
  const handleAutocompleteChange = (_event: any, newValue: T | T[] | null) => {
    if (multiple) {
      if (Array.isArray(newValue)) {
        const values = newValue.map(getOptionValue);
        onChange(values);
      } else {
        onChange([]);
      }
    } else {
      if (newValue) {
        onChange(getOptionValue(newValue as T));
      } else {
        onChange(null);
      }
    }
  };

  // --- Value Derivation for Autocomplete ---
  const getAutocompleteValue = () => {
    if (multiple) {
      if (!Array.isArray(value)) return [];
      // Find all options that match the values in the `value` array
      return options.filter((opt) => {
        const optVal = getOptionValue(opt);
        return value.includes(optVal);
      });
    }
    // Find the single option that matches the `value`
    return options.find((opt) => getOptionValue(opt) === value) || null;
  };

  if (isAutocomplete) {
    return (
      <Autocomplete
        className={className}
        multiple={multiple}
        options={options}
        getOptionLabel={getOptionLabel}
        value={getAutocompleteValue()}
        isOptionEqualToValue={(option, val) =>
          getOptionValue(option) === getOptionValue(val)
        }
        onChange={handleAutocompleteChange}
        disabled={disabled}
        fullWidth={fullWidth}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            name={name}
            required={required}
          />
        )}
        {...props}
      />
    );
  }

  return (
    <FormControl
      fullWidth={fullWidth}
      error={error}
      disabled={disabled}
      className={className}
      required={required}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        label={label}
        value={value ?? (multiple ? [] : "")}
        onChange={handleSelectChange}
        multiple={multiple}
        name={name}
        {...props}
      >
        {options.map((option, index) => {
          const val = getOptionValue(option);
          // Use value as key if primitive, else index
          const key =
            typeof val === "string" || typeof val === "number" ? val : index;
          return (
            <MenuItem key={key} value={val}>
              {getOptionLabel(option)}
            </MenuItem>
          );
        })}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
