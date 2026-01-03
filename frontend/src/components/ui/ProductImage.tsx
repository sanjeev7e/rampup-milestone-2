import { useState } from "react";
import { CardMedia, type CardMediaProps } from "@mui/material";
import { illustrations } from "../../constants/static/images";

interface ProductImageProps extends CardMediaProps {
  image?: string;
}

export default function ProductImage({
  image,
  className,
  ...props
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <CardMedia
      component='img'
      image={!hasError && image ? image : illustrations.productImageNotFound}
      className={className}
      onError={() => setHasError(true)}
      alt='Product image'
      {...props}
    />
  );
}
