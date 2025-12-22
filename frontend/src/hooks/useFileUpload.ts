import { useCallback } from "react";

/**
 * File data structure returned after reading a file
 */
export interface FileData {
  name: string;
  size: number;
  type: string;
  url: string;
}

/**
 * Options for file upload handling
 */
interface UseFileUploadOptions {
  /** File type filter (e.g., 'image/*', '.pdf,.doc') */
  accept?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Callback when files are processed */
  onFilesProcessed: (files: FileData[]) => void;
}

/**
 * Utility function to read a file as a data URL
 */
export const readFileAsDataURL = (file: File): Promise<FileData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve({
          name: file.name,
          size: file.size,
          type: file.type,
          url: e.target.result as string,
        });
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("File reading error"));
    reader.readAsDataURL(file);
  });
};

/**
 * Utility function to format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

/**
 * Custom hook for handling file uploads with drag-and-drop support
 * Follows Single Responsibility Principle - handles only file processing logic
 */
export function useFileUpload({
  accept,
  multiple = false,
  onFilesProcessed,
}: UseFileUploadOptions) {
  /**
   * Validates if a file matches the accept criteria
   */
  const isFileAccepted = useCallback(
    (file: File): boolean => {
      if (!accept) return true;

      const acceptedTypes = accept.split(",").map((t) => t.trim());

      return acceptedTypes.some((acceptType) => {
        // Handle MIME type wildcards (e.g., 'image/*')
        if (acceptType.endsWith("/*")) {
          const baseType = acceptType.slice(0, -2);
          return file.type.startsWith(baseType);
        }
        // Handle file extensions (e.g., '.pdf')
        if (acceptType.startsWith(".")) {
          return file.name.toLowerCase().endsWith(acceptType.toLowerCase());
        }
        // Handle exact MIME types
        return file.type === acceptType;
      });
    },
    [accept]
  );

  /**
   * Process files and convert to FileData
   */
  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const filesToProcess = multiple ? fileArray : [fileArray[0]];
      const validFiles = filesToProcess.filter(
        (file) => file && isFileAccepted(file)
      );

      if (validFiles.length === 0) return;

      try {
        const processedFiles = await Promise.all(
          validFiles.map(readFileAsDataURL)
        );
        onFilesProcessed(processedFiles);
      } catch (error) {
        console.error("Error processing files:", error);
      }
    },
    [multiple, isFileAccepted, onFilesProcessed]
  );

  /**
   * Handle file input change event
   */
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
      // Reset input value to allow selecting the same file again
      event.target.value = "";
    },
    [processFiles]
  );

  /**
   * Handle drag over event - prevents default to allow drop
   */
  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  /**
   * Handle file drop event
   */
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  return {
    handleFileSelect,
    handleDragOver,
    handleDrop,
  };
}
