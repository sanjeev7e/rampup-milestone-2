import { Add, EditOutlined, Search } from "@mui/icons-material";
import AppButton from "../../../components/ui/AppButton";
import AppCard from "../../../components/ui/AppCard";
import { icons, illustrations } from "../../../constants/static/images";

import { useState } from "react";
import { CardMedia, Divider, InputAdornment } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import AppTabs, { type AppTabItem } from "../../../components/ui/AppTabs";
import AppTextField from "../../../components/ui/AppTextField";

const myTabs: AppTabItem[] = [
  {
    label: "Vendor Assigned",
    value: "1",
    content: (
      <TabContentComponennt
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
      <TabContentComponennt
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

  function handleTabChange(_event: React.SyntheticEvent, newValue: string) {
    setCurrentTab(newValue);
  }

  const productDetails = [
    { title: "Product  Name", content: "RCC Cement" },
    {
      title: "Product Description",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    { title: "Form", content: "Powder" },
    { title: "Safety", content: "Flammable" },
    { title: "UOM", content: "Per Unit" },
    { title: "Rate per Unit", content: "200" },
    { title: "Market Selling Price", content: "300" },
    { title: "Sale Profit Margin", content: "50%" },
    { title: "Product Type", content: "n/a" },
    { title: "Product Size", content: "12*12*12" },
    { title: "Product Color", content: "Grey" },
    { title: "Document/Brochure", content: "Product.PDF" },
  ];

  return (
    <div className='flex-1 space-y-10 overflow-x-hidden'>
      <AppCard className='flex-1 p-4 bg-surface!'>
        <div className='flex justify-between items-center mb-5'>
          <h1 className='text-2xl font-medium'>Product Detail</h1>
          <AppButton startIcon={<EditOutlined />}>Edit Product</AppButton>
        </div>

        <div className='flex gap-4'>
          <div className='w-1/2'>
            <h1 className='text-xl font-medium mb-3'>Product Image</h1>
            <Divider className='mb-5!' />
            <ProductCarousel
              images={[
                illustrations.assignmentRequestEmpty,
                illustrations.productsEmpty,
                illustrations.vendorAssignedEmpty,
                illustrations.assignmentRequestEmpty,
                illustrations.productsEmpty,
                illustrations.vendorAssignedEmpty,
                illustrations.assignmentRequestEmpty,
                illustrations.productsEmpty,
                illustrations.vendorAssignedEmpty,
                illustrations.assignmentRequestEmpty,
                illustrations.productsEmpty,
                illustrations.vendorAssignedEmpty,
              ]}
            />
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
              <div className='grid grid-cols-3 gap-10'>
                {productDetails.slice(3).map((productDetail, index) => {
                  return (
                    <TextSectionTitleAndBodyComponent
                      title={productDetail.title}
                      body={productDetail.content}
                    />
                  );
                })}
              </div>
              <TextSectionTitleAndBodyComponent
                title='Document/Brochure'
                body='Product.PDF'
              />
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
  body: string;
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

function TabContentComponennt({ imageSrc, label }) {
  return (
    <div className='flex flex-col items-center gap-5 p-5'>
      <img src={imageSrc} alt='' />
      <h4 className='text-2xl font-medium'>{label}</h4>
    </div>
  );
}
