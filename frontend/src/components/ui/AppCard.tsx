import { Card, type CardProps } from "@mui/material";
import { cn } from "../../utils/cn";

export default function AppCard({ className, children, ...props }: CardProps) {
  return (
    <Card
      {...props}
      className={cn("bg-white! h-fit w-fit shadow-soft!", className)}
    >
      {children}
    </Card>
  );
}
