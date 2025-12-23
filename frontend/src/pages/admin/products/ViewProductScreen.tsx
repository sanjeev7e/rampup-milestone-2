import { EditOutlined, Search } from "@mui/icons-material";
import AppButton from "../../../components/ui/AppButton";
import AppCard from "../../../components/ui/AppCard";
import { icons, illustrations } from "../../../constants/static/images";

import { useState } from "react";
import {
  CardMedia,
  CircularProgress,
  Divider,
  InputAdornment,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import AppTabs, { type AppTabItem } from "../../../components/ui/AppTabs";
import AppTextField from "../../../components/ui/AppTextField";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../../hooks/useProducts";

const myTabs: AppTabItem[] = [
  {
    label: "Vendor Assigned",
    value: "1",
    content: (
      <TabContentComponent
        imageSrc={illustrations.vendorAssignedEmpty}
        label='Add Vendors to Expand Your Business Network'
      />
    ),
    icon: <img src={icons.vendorAssigned} />,
    iconPosition: "start",
  },
  {
    label: "Assignment Request",
    value: "2",
    content: (
      <TabContentComponent
        imageSrc={illustrations.assignmentRequestEmpty}
        label='Add Vendors to Expand Your Business Network'
      />
    ),
    icon: <img src={icons.assignmentRequest} />,
    iconPosition: "start",
  },
];

export default function ViewProductScreen() {
  const [currentTab, setCurrentTab] = useState("1");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch product data
  const { data: product, isLoading, error } = useProduct(id || "");

  function handleTabChange(_event: React.SyntheticEvent, newValue: string) {
    setCurrentTab(newValue);
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-20'>
        <CircularProgress />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className='flex flex-col items-center gap-4 py-10'>
        <p className='text-error text-lg'>Failed to load product</p>
        <p className='text-on-surface-variant'>
          {error?.message || "Product not found"}
        </p>
        <AppButton
          variant='outlined'
          onClick={() => navigate("/admin/products")}
        >
          Back to Products
        </AppButton>
      </div>
    );
  }

  // Prepare images array
  const productImages = [
    product.productImage,
    ...(product.additionalImages || []),
  ].filter(Boolean) as string[];

  // Use placeholder if no images
  const displayImages =
    productImages.length > 0
      ? productImages
      : [illustrations.assignmentRequestEmpty];

  // Build product details
  const productDetails = [
    { title: "Product Name", content: product.productName },
    { title: "Product Category", content: product.productCategory },
    { title: "Product Description", content: product.productDescription },
    { title: "Form", content: product.form },
    { title: "Safety", content: product.safety },
    { title: "UOM", content: product.uom },
    { title: "Rate per Unit", content: `$${product.ratePerUnit}` },
    {
      title: "Market Selling Price",
      content: `$${product.marketSellingPrice}`,
    },
    { title: "Sale Profit Margin", content: `${product.saleProfitMargin}%` },
    { title: "Product Type", content: product.productType || "N/A" },
    { title: "Product Size", content: product.productSize || "N/A" },
    { title: "Product Color", content: product.productColor || "N/A" },
    { title: "Product Variant", content: product.productVariant || "N/A" },
    { title: "Eco Friendly", content: product.ecoFriendly ? "Yes" : "No" },
    {
      title: "Handle with Care",
      content: product.handleWithCare ? "Yes" : "No",
    },
  ];

  return (
    <div className='flex-1 space-y-10 overflow-x-hidden'>
      <AppCard className='flex-1 p-4 bg-surface!'>
        <div className='flex justify-between items-center mb-5'>
          <h1 className='text-2xl font-medium'>Product Detail</h1>
          <AppButton
            startIcon={<EditOutlined />}
            onClick={() => navigate(`/admin/products/edit/${id}`)}
          >
            Edit Product
          </AppButton>
        </div>

        <div className='flex gap-4'>
          <div className='w-1/2'>
            <h1 className='text-xl font-medium mb-3'>Product Image</h1>
            <Divider className='mb-5!' />
            <ProductCarousel images={displayImages} />
          </div>
          <div className='w-1/2'>
            <h1 className='text-xl font-medium mb-3'>Product Basic Details</h1>
            <Divider className='mb-5!' />
            <div className='flex flex-col gap-5 mb-5'>
              <TextSectionTitleAndBodyComponent
                title={productDetails[0].title}
                body={productDetails[0].content}
              />
              <TextSectionTitleAndBodyComponent
                title={productDetails[1].title}
                body={productDetails[1].content}
              />
              <TextSectionTitleAndBodyComponent
                title={productDetails[2].title}
                body={productDetails[2].content}
              />
              <div className='grid grid-cols-3 gap-10'>
                {productDetails.slice(3).map((productDetail) => (
                  <TextSectionTitleAndBodyComponent
                    key={productDetail.title}
                    title={productDetail.title}
                    body={productDetail.content}
                  />
                ))}
              </div>
              {product.productBrochure && (
                <TextSectionTitleAndBodyComponent
                  title='Document/Brochure'
                  body={
                    <a
                      href={product.productBrochure}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary underline'
                    >
                      View Brochure
                    </a>
                  }
                />
              )}
              <div className='flex gap-5'>
                {product.ecoFriendly && (
                  <div className='flex gap-2'>
                    <img src={icons.ecoFriendly} alt='Eco friendly' />
                    <p>Eco friendly</p>
                  </div>
                )}
                {product.handleWithCare && (
                  <div className='flex gap-2'>
                    <img src={icons.handleWithCare} alt='Handle with care' />
                    <p>Handle with care</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AppCard>
      <AppCard className='flex-1 w-full'>
        <AppTabs
          value={currentTab}
          onChange={handleTabChange}
          tabs={myTabs}
          boxProps={{
            className: "mx-3",
          }}
          otherActions={
            <div className='flex gap-4'>
              <AppTextField
                placeholder='Search'
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='start'>
                        <Search />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <AppButton
                variant='contained'
                className='bg-primary! h-[-webkit-fill-available]'
              >
                Assign Vendors
              </AppButton>
            </div>
          }
        />
      </AppCard>
    </div>
  );
}

// Reusable components
function TitleComponent({ children }: { children: React.ReactNode }) {
  return (
    <h2 className='text-xs font-medium text-on-surface-variant'>{children}</h2>
  );
}

function BodyCompoennt({ children }: { children: React.ReactNode }) {
  return <p className='text-on-surface'>{children}</p>;
}

function TextSectionTitleAndBodyComponent({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div>
      <TitleComponent>{title}</TitleComponent>
      <BodyCompoennt>{body}</BodyCompoennt>
    </div>
  );
}

function ProductCarousel({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));

  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div>
      {/* Main Image */}
      <AppCard className='relative w-full h-full rounded-xl aspect-square mb-4'>
        <CardMedia
          component='img'
          image={images[active]}
          className='w-full h-full object-contain'
        />

        {/* Left Arrow */}
        <AppButton
          type='icon-button'
          onClick={prev}
          className='rounded-lg! absolute! top-1/2! left-3! z-10 bg-inverse-on-surface/80! hover:bg-inverse-on-surface!'
        >
          <ChevronLeft />
        </AppButton>

        {/* Right Arrow */}
        <AppButton
          type='icon-button'
          onClick={next}
          className='rounded-lg! absolute! top-1/2! right-3! z-10 bg-inverse-on-surface/80! hover:bg-inverse-on-surface!'
        >
          <ChevronRight />
        </AppButton>
      </AppCard>

      {/* Thumbnails */}
      <div className='flex overflow-x-auto gap-5'>
        {images.map((img, index) => (
          <div
            key={img}
            onClick={() => setActive(index)}
            className={` ${
              active === index ? "border-primary!" : ""
            } w-20 h-24 shrink-0 cursor-pointer border border-surface-variant rounded-md overflow-hidden`}
          >
            <img
              src={img}
              className='w-full h-full object-contain aspect-square'
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function TabContentComponent({
  imageSrc,
  label,
}: {
  imageSrc: string;
  label: string;
}) {
  return (
    <div className='flex flex-col items-center gap-5 p-5'>
      <img src={imageSrc} alt='' />
      <h4 className='text-2xl font-medium'>{label}</h4>
    </div>
  );
}
