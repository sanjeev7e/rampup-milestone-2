import { CardContent, CardMedia } from "@mui/material";
import AppButton from "../ui/AppButton";
import { MoreVert } from "@mui/icons-material";
import AppCard from "../ui/AppCard";

export default function AdminProductsListCard({
  name,
  brand,
  category,
  price,
  image,
  onClick,
}: {
  name: string;
  brand?: string;
  category: string;
  price: number;
  image: string;
  onClick?: () => void;
}) {
  return (
    <div className='relative w-fit'>
      <AppCard onClick={onClick}>
        <CardMedia
          component='img'
          className='object-cover w-[195px] h-[195px]'
          image={image}
          alt='Paella dish'
        />
        <CardContent className='space-y-5'>
          <div className='space-y-1'>
            <p className='font-medium text-sm'>{name}</p>
            <p className='text-xs'>
              {brand && category ? `${brand}/${category}` : brand || category}
            </p>
          </div>
          <p className='font-medium! text-sm text-primary'>$ {price}</p>
        </CardContent>
      </AppCard>
      <AppButton
        type='icon-button'
        className='absolute! top-3! right-3! z-10 bg-inverse-on-surface/80! text-on-inverse-on-surface! hover:bg-inverse-on-surface!'
      >
        <MoreVert fontSize='small' />
      </AppButton>
    </div>
  );
}
