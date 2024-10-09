import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        sx={{ height: '200px', objectFit: 'cover' }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" >
          {product.name}
        </Typography>
        {/* <Box  color="text.secondary">          
          ${product.price}
        </Box> */}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
