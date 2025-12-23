import { useState } from "react";
import {
  CardContent,
  CardMedia,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AppButton from "../ui/AppButton";
import { MoreVert, Edit, Delete } from "@mui/icons-material";
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
    <div className='relative w-fit'>
      <AppCard onClick={onClick}>
        <CardMedia
          component='img'
          className='object-cover w-[195px] h-[195px]'
          image={image}
          alt='Product image'
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
        PaperProps={{
          className: "w-[120px]",
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize='small' />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Delete fontSize='small' color='error' />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: "error" }}>
            Delete
          </ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
