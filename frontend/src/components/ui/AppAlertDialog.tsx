import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  type DialogProps,
} from "@mui/material";
import { type ReactNode, useId } from "react";

export interface AppAlertDialogProps
  extends Omit<DialogProps, "title" | "content"> {
  title: ReactNode;
  /**
   * Text/Content to display inside a DialogContentText wrapper.
   * For complex content, use `children` instead.
   */
  content?: ReactNode;
  /**
   * Custom actions to replace the default buttons.
   */
  actions?: ReactNode;
}

export default function AppAlertDialog({
  open,
  onClose,
  title,
  content,
  actions,
  children,
  ...props
}: AppAlertDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      {...props}
    >
      <DialogTitle id={titleId} component='div'>
        {title}
      </DialogTitle>
      <DialogContent>
        {content && (
          <DialogContentText id={descriptionId}>{content}</DialogContentText>
        )}
        {children}
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
}
