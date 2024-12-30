import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Grid,
  CardActionArea,
  CardContent,
  Divider,
} from '@mui/material';
import { Product } from '@/types';
import { ProductGridDisplay } from './product-grid-display';
import { searchProduct } from '../api/search-product';
const useStyles = {
  card: {
    margin: 'auto',
    marginTop: 20,
    padding: 16,
  },
  gridContainer: {
    background: '#fafafa',
  },
  categoryCard: (selected: boolean) => ({
    backgroundColor: selected ? 'green' : 'gray',
    height: '64px',
  }),
  categoryText: {
    color: 'white',
    textAlign: 'center',
    cursor: 'pointer',
  },
  divider: {
    margin: '16px 0',
  },
};

interface ProductCategoryListProps {
  categories: string[];
}
export const ProductCategoryList: React.FC<ProductCategoryListProps> = (
  props,
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    props.categories.length > 0 ? props.categories[0] : '',
  );

  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        const data = await searchProduct({ category: selectedCategory });
        setProducts(data);
      } catch (error) {
        console.error('Error fetching initial products:', error);
      }
    };
    fetchInitialProducts();
  }, [selectedCategory]);

  const fetchProductsByCategory = (category: string) => async () => {
    setSelectedCategory(category);
    try {
      const data = await searchProduct({ category });
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products by category:', error);
    }
  };

  return (
    <div>
      <Card sx={useStyles.card}>
        <Typography variant="h5" align="center" gutterBottom>
          Explore by Category
        </Typography>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={useStyles.gridContainer}
        >
          {props.categories &&
            props.categories.map((category, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card
                  sx={useStyles.categoryCard(selectedCategory === category)}
                >
                  <CardActionArea onClick={fetchProductsByCategory(category)}>
                    <CardContent>
                      <Typography variant="h6" sx={useStyles.categoryText}>
                        {category}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
        <Divider sx={useStyles.divider} />
        <ProductGridDisplay products={products} isSearched={false} />
      </Card>
    </div>
  );
};
