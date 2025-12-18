import {
  Checkbox,
  type CheckboxProps,
  FormControlLabel,
  type FormControlLabelProps,
} from "@mui/material";

interface AppCheckboxProps extends CheckboxProps {
  label: React.ReactNode;
  labelPlacement?: "start" | "end" | "top" | "bottom";
  disableTypography?: FormControlLabelProps["disableTypography"];
  formControlLabelProps?: Omit<
    FormControlLabelProps,
    | "control"
    | "label"
    | "labelPlacement"
    | "checked"
    | "defaultChecked"
    | "disabled"
    | "onChange"
    | "name"
    | "value"
    | "className"
    | "disableTypography"
  >;
}

export default function AppCheckbox({
  label,
  labelPlacement = "start",
  className,
  disabled,
  disableTypography,
  formControlLabelProps,
  ...props
}: AppCheckboxProps) {
  return (
    <FormControlLabel
      className={className}
      disabled={disabled}
      disableTypography={disableTypography}
      {...formControlLabelProps}
      control={<Checkbox {...props} />}
      label={label}
      labelPlacement={labelPlacement}
    />
  );
}
