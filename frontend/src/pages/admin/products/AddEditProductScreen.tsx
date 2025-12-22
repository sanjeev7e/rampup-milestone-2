import AppCard from "../../../components/ui/AppCard";
import { useState, useCallback } from "react";
import { Divider } from "@mui/material";
import {
  OutboxOutlined,
  CloseOutlined,
  InsertDriveFileOutlined,
} from "@mui/icons-material";
import AppTextField from "../../../components/ui/AppTextField";
import AppSelect from "../../../components/ui/AppSelect";
import AppCheckbox from "../../../components/ui/AppCheckbox";
import AppButton from "../../../components/ui/AppButton";
import AppDropZone from "../../../components/ui/AppDropZone";
import {
  useFileUpload,
  formatFileSize,
  FileData,
} from "../../../hooks/useFileUpload";
import { icons } from "../../../constants/static/images";

interface BrochureFile {
  name: string;
  size: number;
  url: string;
}

export default function AddEditProductScreen() {
  const [productImages, setProductImages] = useState<string[]>([]);
  const [brochureFile, setBrochureFile] = useState<BrochureFile | null>(null);

  return (
    <div className='flex-1 space-y-10 overflow-x-hidden'>
      <div className='flex-1 p-4'>
        <div className='flex gap-4'>
          <AppCard className='w-1/2 p-5 bg-surface!'>
            <h1 className='text-xl font-medium mb-3'>Upload Product Image</h1>
            <Divider className='mb-5!' />
            <ProductImageUpload
              images={productImages}
              onImagesChange={setProductImages}
            />
          </AppCard>

          <AppCard className='w-1/2 p-5 bg-surface! space-y-10'>
            <div>
              <h1 className='text-xl font-medium mb-3'>
                Product Basic Details
              </h1>
              <Divider className='mb-5!' />
              <div className='flex flex-col gap-5 mb-5'>
                <AppTextField label='Product Name' />
                <AppSelect
                  label='Product Category'
                  options={["Option 1", "Option 2"]}
                  value={""}
                  onChange={(value: string) => {
                    console.log(value);
                  }}
                />
                <AppTextField
                  label='Product Description'
                  multiline
                  minRows={5}
                />
              </div>
            </div>
            <div>
              <h1 className='text-xl font-medium mb-3'>
                Additional Product Atributes
              </h1>
              <Divider className='mb-5!' />
              <div className='grid grid-cols-2 gap-5 mb-5'>
                <AppSelect
                  label='Form'
                  options={["Option 1", "Option 2"]}
                  value={""}
                  onChange={(value: string) => {
                    console.log(value);
                  }}
                />
                <AppSelect
                  label='Safety'
                  options={["Option 1", "Option 2"]}
                  value={""}
                  onChange={(value: string) => {
                    console.log(value);
                  }}
                />
                <AppSelect
                  label='UOM'
                  options={["Option 1", "Option 2"]}
                  value={""}
                  onChange={(value: string) => {
                    console.log(value);
                  }}
                />
              </div>
              <div>
                <AppCheckbox label='Eco Friendly' />
                <AppCheckbox label='Handle with Care' />
              </div>
            </div>
            <div>
              <h1 className='text-xl font-medium mb-3'>
                Pricing and Rate Settings
              </h1>
              <Divider className='mb-5!' />
              <div className='grid grid-cols-2 gap-5 mb-5'>
                <AppTextField label='Rate per Unit' />
                <AppTextField label='Market Selling Price' />
                <AppTextField label='Sale Profit Margin' />
              </div>
            </div>
            <div>
              <h1 className='text-xl font-medium mb-3'>
                Other Details (optional)
              </h1>
              <Divider className='mb-5!' />
              <div className='grid grid-cols-2 gap-5 mb-5'>
                <AppTextField label='Product Type' />
                <AppTextField label='Product  Size(L*W*H)' />
                <AppTextField label='Product Variant' />
                <AppTextField label='Product Color' />
              </div>
            </div>
            <div>
              <h1 className='text-xl font-medium mb-3'>
                Upload Product Brochure (optional)
              </h1>
              <Divider className='mb-5!' />
              <BrochureUpload
                file={brochureFile}
                onFileChange={setBrochureFile}
              />
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  );
}

/**
 * ProductImageUpload Component
 * Handles multiple image uploads with preview thumbnails
 */
function ProductImageUpload({
  images,
  onImagesChange,
}: {
  images: string[];
  onImagesChange?: (images: string[]) => void;
}) {
  // Use the shared file upload hook
  const handleFilesProcessed = useCallback(
    (files: FileData[]) => {
      const newUrls = files.map((f) => f.url);
      onImagesChange?.([...images, ...newUrls]);
    },
    [images, onImagesChange]
  );

  const { handleFileSelect, handleDragOver, handleDrop } = useFileUpload({
    accept: "image/*",
    multiple: true,
    onFilesProcessed: handleFilesProcessed,
  });

  const removeImage = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange?.(newImages);
    },
    [images, onImagesChange]
  );

  return (
    <div>
      <AppDropZone
        accept='image/*'
        multiple
        onFileSelect={handleFileSelect}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className='border-2 rounded-xl bg-inverse-on-surface mb-4'
      >
        <div className='flex flex-col items-center justify-center py-16 px-4'>
          <div className='mb-6'>
            <img src={icons.photoPlaceholder} alt='' />
          </div>
          <h4 className='text-lg mb-1'>
            <span className='text-primary font-semibold text-sm'>
              Click to Upload Product Picture
            </span>
          </h4>
          <p className='text-on-surface-variant text-xs'>or</p>
          <p className='text-on-surface-variant text-xs'>drag and drop</p>
        </div>
      </AppDropZone>

      <ImageThumbnailGrid images={images} onRemove={removeImage} />
    </div>
  );
}

/**
 * ImageThumbnailGrid Component
 * Displays uploaded images with remove functionality
 * Follows Single Responsibility - only handles thumbnail display
 */
function ImageThumbnailGrid({
  images,
  onRemove,
  placeholderCount = 4,
}: {
  images: string[];
  onRemove: (index: number) => void;
  placeholderCount?: number;
}) {
  const emptySlots = Math.max(0, placeholderCount - images.length);

  return (
    <div className='flex overflow-x-auto gap-4'>
      {/* Uploaded images */}
      {images.map((img, index) => (
        <div
          key={index}
          className='relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-primary/10 border border-surface-variant group'
        >
          <img
            src={img}
            alt={`Uploaded ${index + 1}`}
            className='w-full h-full object-cover'
          />
          <AppButton
            type='icon-button'
            onClick={() => onRemove(index)}
            className='absolute! top-1! right-1! opacity-0 group-hover:opacity-100 transition-opacity'
          >
            <CloseOutlined />
          </AppButton>
        </div>
      ))}

      {/* Empty placeholder slots */}
      {Array.from({ length: emptySlots }).map((_, index) => (
        <div
          key={`empty-${index}`}
          className='w-20 h-20 shrink-0 rounded-lg bg-primary/10'
        />
      ))}
    </div>
  );
}

/**
 * BrochureUpload Component
 * Handles single document file upload with file info display
 */
function BrochureUpload({
  file,
  onFileChange,
}: {
  file: BrochureFile | null;
  onFileChange?: (file: BrochureFile | null) => void;
}) {
  // Use the shared file upload hook
  const handleFilesProcessed = useCallback(
    (files: FileData[]) => {
      if (files.length > 0) {
        const { name, size, url } = files[0];
        onFileChange?.({ name, size, url });
      }
    },
    [onFileChange]
  );

  const { handleFileSelect, handleDragOver, handleDrop } = useFileUpload({
    accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx",
    multiple: false,
    onFilesProcessed: handleFilesProcessed,
  });

  const removeFile = useCallback(() => {
    onFileChange?.(null);
  }, [onFileChange]);

  return (
    <div className='mb-5'>
      {/* Upload Area - using reusable DropZone */}
      <AppDropZone
        accept='.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
        onFileSelect={handleFileSelect}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className='bg-transparent'
      >
        <div className='flex flex-col items-center justify-center py-6 px-4 gap-2'>
          <div className='rounded-full bg-inverse-primary p-2 w-fit'>
            <OutboxOutlined />
          </div>
          <h4>
            <span className='text-primary font-semibold'> Click to Upload</span>{" "}
            or drag and drop
          </h4>
          <p className='text-xs text-on-surface-variant'>
            (Max. File size: 25 MB)
          </p>
        </div>
      </AppDropZone>

      {/* File Preview - extracted for clarity */}
      {file && <FilePreview file={file} onRemove={removeFile} />}
    </div>
  );
}

/**
 * FilePreview Component
 * Displays file information with remove option
 * Follows Single Responsibility - only handles file preview display
 */
function FilePreview({
  file,
  onRemove,
}: {
  file: BrochureFile;
  onRemove: () => void;
}) {
  return (
    <div className='mt-4 p-3 bg-surface-variant/50 rounded-lg flex items-center gap-3'>
      <div className='p-2 bg-primary/10 rounded-lg'>
        <InsertDriveFileOutlined className='text-primary' />
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium truncate'>{file.name}</p>
        <p className='text-xs text-on-surface-variant'>
          {formatFileSize(file.size)}
        </p>
      </div>
      <AppButton
        type='icon-button'
        onClick={onRemove}
        className='shrink-0'
        size='small'
      >
        <CloseOutlined fontSize='small' />
      </AppButton>
    </div>
  );
}
