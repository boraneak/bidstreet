import React, { useState, useEffect } from 'react';
import { Product } from '../../types/Product';
import {
  Card,
  Typography,
  Grid,
  CardActionArea,
  CardContent,
  Divider,
} from '@mui/material';
import Products from './ProductsGrid';
import { searchProduct } from '../../API/productAPI';

interface CategoryProps {
  categories: string[];
}

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

const ProductCategory: React.FC<CategoryProps> = (props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<string>(
    props.categories.length > 0 ? props.categories[0] : '',
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await searchProduct({ category: selected });
        setProducts(data);
      } catch (error) {
        console.error('Error fetching product by selected category:', error);
      }
    };
    fetchProduct();
  }, [selected]);

  const listbyCategory = (category: string) => async () => {
    setSelected(category);
    try {
      const data = await searchProduct({ category });
      setProducts(data);
    } catch (error) {
      console.error(error);
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
                <Card sx={useStyles.categoryCard(selected === category)}>
                  <CardActionArea onClick={listbyCategory(category)}>
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
        <Products products={products} searched={false} />
      </Card>
    </div>
  );
};

export default ProductCategory;
