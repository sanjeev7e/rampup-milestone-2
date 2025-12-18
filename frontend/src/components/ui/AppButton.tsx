import { Button, IconButton } from "@mui/material";

// Extend standard button attributes to support className, onClick, etc.
interface BaseProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "color" | "type"
  > {
  children: React.ReactNode;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  loading?: boolean;
  loadingIndicator?: React.ReactNode;
  classname?: string | undefined;
}

interface ButtonModeProps extends BaseProps {
  type?: "button";
  disableElevation?: boolean;
  endIcon?: React.ReactNode;
  loadingPosition?: "center" | "end" | "start";
  startIcon?: React.ReactNode;
  variant?: "contained" | "outlined" | "text";
}

interface IconButtonModeProps extends BaseProps {
  type: "icon-button";
}

type AppButtonProps = ButtonModeProps | IconButtonModeProps;

export default function AppButton(props: AppButtonProps) {
  if (props.type === "icon-button") {
    const {
      children,
      color,
      disabled,
      size,
      loading,
      loadingIndicator,
      type, // eslint-disable-line
      classname,
      ...other
    } = props;

    return (
      <IconButton
        className={classname}
        color={color}
        disabled={disabled}
        size={size}
        loading={loading}
        loadingIndicator={loadingIndicator}
        {...other}
      >
        {children}
      </IconButton>
    );
  }

  const {
    children,
    color,
    disabled,
    disableElevation,
    endIcon,
    loading,
    loadingIndicator,
    loadingPosition,
    size,
    startIcon,
    variant,
    type, // eslint-disable-line
    classname,
    ...other
  } = props;

  return (
    <Button
      className={`rounded! ${classname}`}
      color={color}
      disabled={disabled}
      disableElevation={disableElevation}
      endIcon={endIcon}
      loading={loading}
      loadingIndicator={loadingIndicator}
      loadingPosition={loadingPosition}
      size={size}
      startIcon={startIcon}
      variant={variant}
      {...other}
    >
      {children}
    </Button>
  );
}
