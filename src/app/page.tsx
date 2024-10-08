'use client'
import ProductCard from "@/common/components/card/RoomCard";
import { Box, Button, Container, Grid, Modal, Typography } from "@mui/material";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}
export default function Home() {
  const products: Product[] = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    price: parseFloat((Math.random() * 100).toFixed(2)),
    image: 'https://via.placeholder.com/150',
  }));
  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      
      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product}  />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
