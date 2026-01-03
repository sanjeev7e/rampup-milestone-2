import { useState } from "react";
import {
  CardContent,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AppButton from "../ui/AppButton";
import ProductImage from "../ui/ProductImage";
import { MoreVert } from "@mui/icons-material";
import AppCard from "../ui/AppCard";

export default function AdminProductsListCard({
  name,
  brand,
  category,
  price,
  image,
  onClick,
  onEdit,
  onDelete,
}: {
  name: string;
  brand?: string;
  category: string;
  price: number;
  image: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleClose();
    onEdit?.();
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleClose();
    onDelete?.();
  };

  return (
    <div className='relative w-full min-w-fit'>
      <AppCard onClick={onClick}>
        <ProductImage
          image={image}
          key={image}
          className='object-cover w-48 h-48'
        />
        <CardContent className='space-y-5'>
          <div className='space-y-1'>
            <p className='font-medium text-sm truncate w-[165px]'>{name}</p>
            <p className='text-xs text-secondary truncate w-[165px]'>
              {brand && category ? `${brand}/${category}` : brand || category}
            </p>
          </div>
          <p className='font-medium! text-sm text-primary'>$ {price}</p>
        </CardContent>
      </AppCard>
      <AppButton
        type='icon-button'
        className='absolute! top-3! right-3! z-10 bg-inverse-on-surface/80! text-on-inverse-on-surface! hover:bg-inverse-on-surface!'
        onClick={handleMenuClick}
      >
        <MoreVert fontSize='small' />
      </AppButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemText
            className='text-primary'
            primaryTypographyProps={{ fontWeight: "medium" }}
          >
            Edit
          </ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText
            className='text-primary'
            primaryTypographyProps={{ fontWeight: "medium" }}
          >
            Archive Product
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemText
            className='text-error'
            primaryTypographyProps={{ fontWeight: "medium" }}
          >
            Delete
          </ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
