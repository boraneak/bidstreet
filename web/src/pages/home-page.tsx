import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import getProductCategories from '@/features/products/api/get-product-categories';
import { ProductCategoryList } from '@/features/products/components/product-category-list';
import { ProductSearchPanel } from '@/features/products/components/product-search-panel';
import { ProductCategories } from '@/types';

export const HomePage: React.FC = () => {
  const [productCategories, setProductCategories] = useState<ProductCategories>(
    [],
  );

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const data = await getProductCategories();
        setProductCategories(data);
      } catch (error) {
        console.error('Error fetching product categories:', error);
      }
    };
    fetchProductCategories();
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
