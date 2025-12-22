import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

/**
 * Props for the DropZone component
 * Follows Interface Segregation Principle - minimal, focused interface
 */
interface AppDropZoneProps {
  /** File types to accept */
  accept: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Handler for file input change */
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Handler for drag over */
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  /** Handler for file drop */
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  /** Custom content to display inside the drop zone */
  children: ReactNode;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * Reusable DropZone component for file upload areas
 * Follows Open/Closed Principle - extensible via children and className props
 */
export default function AppDropZone({
  accept,
  multiple = false,
  onFileSelect,
  onDragOver,
  onDrop,
  children,
  className = "",
}: AppDropZoneProps) {
  const baseClasses =
    "relative border border-dashed border-primary rounded-lg cursor-pointer transition-all hover:bg-primary/5";

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      className={cn(baseClasses, className)}
    >
      <input
        type='file'
        accept={accept}
        multiple={multiple}
        onChange={onFileSelect}
        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
      />
      {children}
    </div>
  );
}
