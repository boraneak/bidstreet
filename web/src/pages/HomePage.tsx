import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { listProductCategories } from '../API/productAPI';
import ProductCategoryList from '../components/product/ProductCategoryList';
import ProductSearchPanel from '../components/product/ProductSearchPanel';
import { ProductCategories } from '../types/ProductCategories';

const HomePage: React.FC = () => {
  const [productCategories, setProductCategories] = useState<ProductCategories>(
    [],
  );

  useEffect(() => {
    const getProductCategories = async () => {
      try {
        const data = await listProductCategories();
        setProductCategories(data);
      } catch (error) {
        console.error('Error fetching product categories:', error);
      }
    };
    getProductCategories();
  }, []);

  return (
    <div style={{ flexGrow: 1, marginTop: 70 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ProductSearchPanel productCategories={productCategories} />
          <ProductCategoryList categories={productCategories} />
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
