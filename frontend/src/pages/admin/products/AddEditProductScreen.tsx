import AppCard from "../../../components/ui/AppCard";
import { useState, useCallback, useEffect } from "react";
import { Divider, CircularProgress, Alert } from "@mui/material";
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
import { useFileUpload, formatFileSize } from "../../../hooks/useFileUpload";
import type { FileData } from "../../../hooks/useFileUpload";
import { icons } from "../../../constants/static/images";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateProduct,
  useUpdateProduct,
  useProduct,
} from "../../../hooks/useProducts";
import type { CreateProductRequest } from "../../../types/products";

interface BrochureFile {
  name: string;
  size: number;
  url: string;
}

// Form options
const CATEGORY_OPTIONS = [
  "Electronics",
  "Clothing",
  "Food",
  "Chemicals",
  "Other",
];
const FORM_OPTIONS = ["Solid", "Liquid", "Powder", "Gas"];
const SAFETY_OPTIONS = [
  "Flammable",
  "Non-Flammable",
  "Corrosive",
  "Toxic",
  "Safe",
];
const UOM_OPTIONS = ["Per Unit", "Per Kg", "Per Liter", "Per Meter", "Per Box"];

// Initial form state
const initialFormState: CreateProductRequest = {
  productName: "",
  productCategory: "",
  productDescription: "",
  form: "",
  safety: "",
  uom: "",
  ratePerUnit: 0,
  marketSellingPrice: 0,
  saleProfitMargin: 0,
  productType: "",
  productSize: "",
  productColor: "",
  productVariant: "",
  ecoFriendly: false,
  handleWithCare: false,
  productImage: "",
  additionalImages: [],
  productBrochure: "",
};

export default function AddEditProductScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [formData, setFormData] =
    useState<CreateProductRequest>(initialFormState);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [brochureFile, setBrochureFile] = useState<BrochureFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch existing product if editing
  const { data: existingProduct, isLoading: isLoadingProduct } = useProduct(
    id || ""
  );

  // Initialize form with existing data in edit mode
  useEffect(() => {
    if (existingProduct && isEditMode && !isInitialized) {
      setIsInitialized(true);
      setFormData({
        productName: existingProduct.productName,
        productCategory: existingProduct.productCategory,
        productDescription: existingProduct.productDescription,
        form: existingProduct.form,
        safety: existingProduct.safety,
        uom: existingProduct.uom,
        ratePerUnit: existingProduct.ratePerUnit,
        marketSellingPrice: existingProduct.marketSellingPrice,
        saleProfitMargin: existingProduct.saleProfitMargin,
        productType: existingProduct.productType || "",
        productSize: existingProduct.productSize || "",
        productColor: existingProduct.productColor || "",
        productVariant: existingProduct.productVariant || "",
        ecoFriendly: existingProduct.ecoFriendly,
        handleWithCare: existingProduct.handleWithCare,
        productImage: existingProduct.productImage || "",
        additionalImages: existingProduct.additionalImages || [],
        productBrochure: existingProduct.productBrochure || "",
      });

      // Set images
      const images = [
        existingProduct.productImage,
        ...(existingProduct.additionalImages || []),
      ].filter(Boolean) as string[];
      setProductImages(images);

      // Set brochure
      if (existingProduct.productBrochure) {
        setBrochureFile({
          name: "Product Brochure",
          size: 0,
          url: existingProduct.productBrochure,
        });
      }
    }
  }, [existingProduct, isEditMode, isInitialized]);

  const createMutation = useCreateProduct({
    onSuccess: () => {
      navigate("/admin/products");
    },
    onError: (err) => {
      setError(err.getUserMessage());
    },
  });

  const updateMutation = useUpdateProduct({
    onSuccess: () => {
      navigate("/admin/products");
    },
    onError: (err) => {
      setError(err.getUserMessage());
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Update form field
  const updateField = <K extends keyof CreateProductRequest>(
    field: K,
    value: CreateProductRequest[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = () => {
    setError(null);

    // Basic validation
    if (!formData.productName.trim()) {
      setError("Product name is required");
      return;
    }
    if (!formData.productCategory) {
      setError("Product category is required");
      return;
    }
    if (!formData.productDescription.trim()) {
      setError("Product description is required");
      return;
    }
    if (!formData.form) {
      setError("Form is required");
      return;
    }
    if (!formData.safety) {
      setError("Safety is required");
      return;
    }
    if (!formData.uom) {
      setError("UOM is required");
      return;
    }

    // Prepare data with images
    const submitData: CreateProductRequest = {
      ...formData,
      productImage: productImages[0] || "",
      additionalImages: productImages.slice(1),
      productBrochure: brochureFile?.url || "",
    };

    if (isEditMode && id) {
      updateMutation.mutate({ id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  // Loading state for edit mode
  if (isEditMode && isLoadingProduct) {
    return (
      <div className='flex justify-center items-center py-20'>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className='flex-1 space-y-10 overflow-x-hidden'>
      <div className='flex-1 p-4'>
        {/* Error Alert */}
        {error && (
          <Alert
            severity='error'
            className='mb-4'
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

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
                <AppTextField
                  label='Product Name'
                  value={formData.productName}
                  onChange={(e) => updateField("productName", e.target.value)}
                  required
                />
                <AppSelect
                  label='Product Category'
                  options={CATEGORY_OPTIONS}
                  value={formData.productCategory}
                  onChange={(value: string) =>
                    updateField("productCategory", value)
                  }
                />
                <AppTextField
                  label='Product Description'
                  multiline
                  minRows={5}
                  value={formData.productDescription}
                  onChange={(e) =>
                    updateField("productDescription", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div>
              <h1 className='text-xl font-medium mb-3'>
                Additional Product Attributes
              </h1>
              <Divider className='mb-5!' />
              <div className='grid grid-cols-2 gap-5 mb-5'>
                <AppSelect
                  label='Form'
                  options={FORM_OPTIONS}
                  value={formData.form}
                  onChange={(value: string) => updateField("form", value)}
                />
                <AppSelect
                  label='Safety'
                  options={SAFETY_OPTIONS}
                  value={formData.safety}
                  onChange={(value: string) => updateField("safety", value)}
                />
                <AppSelect
                  label='UOM'
                  options={UOM_OPTIONS}
                  value={formData.uom}
                  onChange={(value: string) => updateField("uom", value)}
                />
              </div>
              <div>
                <AppCheckbox
                  label='Eco Friendly'
                  checked={formData.ecoFriendly}
                  onChange={(e) => updateField("ecoFriendly", e.target.checked)}
                />
                <AppCheckbox
                  label='Handle with Care'
                  checked={formData.handleWithCare}
                  onChange={(e) =>
                    updateField("handleWithCare", e.target.checked)
                  }
                />
              </div>
            </div>
            <div>
              <h1 className='text-xl font-medium mb-3'>
                Pricing and Rate Settings
              </h1>
              <Divider className='mb-5!' />
              <div className='grid grid-cols-2 gap-5 mb-5'>
                <AppTextField
                  label='Rate per Unit'
                  type='number'
                  value={formData.ratePerUnit || ""}
                  onChange={(e) =>
                    updateField("ratePerUnit", Number(e.target.value))
                  }
                />
                <AppTextField
                  label='Market Selling Price'
                  type='number'
                  value={formData.marketSellingPrice || ""}
                  onChange={(e) =>
                    updateField("marketSellingPrice", Number(e.target.value))
                  }
                />
                <AppTextField
                  label='Sale Profit Margin (%)'
                  type='number'
                  value={formData.saleProfitMargin || ""}
                  onChange={(e) =>
                    updateField("saleProfitMargin", Number(e.target.value))
                  }
                />
              </div>
            </div>
            <div>
              <h1 className='text-xl font-medium mb-3'>
                Other Details (optional)
              </h1>
              <Divider className='mb-5!' />
              <div className='grid grid-cols-2 gap-5 mb-5'>
                <AppTextField
                  label='Product Type'
                  value={formData.productType || ""}
                  onChange={(e) => updateField("productType", e.target.value)}
                />
                <AppTextField
                  label='Product Size (L*W*H)'
                  value={formData.productSize || ""}
                  onChange={(e) => updateField("productSize", e.target.value)}
                />
                <AppTextField
                  label='Product Variant'
                  value={formData.productVariant || ""}
                  onChange={(e) =>
                    updateField("productVariant", e.target.value)
                  }
                />
                <AppTextField
                  label='Product Color'
                  value={formData.productColor || ""}
                  onChange={(e) => updateField("productColor", e.target.value)}
                />
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

            {/* Submit Button */}
            <div className='flex justify-end gap-4 pt-4'>
              <AppButton
                variant='outlined'
                onClick={() => navigate("/admin/products")}
                disabled={isPending}
              >
                Cancel
              </AppButton>
              <AppButton
                variant='contained'
                onClick={handleSubmit}
                disabled={isPending}
                startIcon={
                  isPending ? <CircularProgress size={20} /> : undefined
                }
              >
                {isPending
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Product"
                  : "Create Product"}
              </AppButton>
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
