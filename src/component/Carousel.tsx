'use client'
import React, { useState } from 'react';
import { Box, Button, Card, CardMedia, Typography } from '@mui/material';

const images = [
  {
    src: 'https://spacet-release.s3.ap-southeast-1.amazonaws.com/img/blog/2023-10-04/mau-thiet-ke-phong-tro-dep-duoc-bo-tri-noi-that-hop-ly-651cda67c9649b0ef5c6f498.webp',
    title: 'Hình ảnh 1',
    href: '/page1',
  },
  {
    src: 'https://spacet-release.s3.ap-southeast-1.amazonaws.com/img/blog/2023-10-04/651cda61c9649b0ef5c6f212.webp',
    title: 'Hình ảnh 2',
    href: '/page2',
  },
  {
    src: 'https://kfa.vn/wp-content/uploads/2021/08/thiet-ke-phong-tro-dep-9.jpg',
    title: 'Hình ảnh 3',
    href: '/page3',
  },
];

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleImageClick = (href: string) => {
    window.location.href = href; 
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '400px' }}>
      <Button 
        onClick={handlePrev} 
        sx={{ position: 'absolute', top: '50%', left: '16px', zIndex: 1 }}
      >
        &lt;
      </Button>

      <Card 
        onClick={() => handleImageClick(images[currentIndex].href)}
        sx={{ height: '100%', cursor: 'pointer' }}
      >
        <CardMedia
          component="img"
          height="100%"
          image={images[currentIndex].src}
          alt={images[currentIndex].title}
        />
        <Typography variant="h5" component="div" sx={{ position: 'absolute', bottom: '16px', left: '16px', color: 'white' }}>
          {images[currentIndex].title}
        </Typography>
      </Card>

      <Button 
        onClick={handleNext} 
        sx={{ position: 'absolute', top: '50%', right: '16px', zIndex: 1 }}
      >
        &gt;
      </Button>
    </Box>
  );
};

export default Carousel;
