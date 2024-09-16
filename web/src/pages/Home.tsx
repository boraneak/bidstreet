import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { listProductCategories } from "../API/productAPI";
import Categories from "../components/product/Categories";
import Search from "../components/product/Search";
import { ProductCategories } from "../types/ProductCategories";

const Home: React.FC = () => {
  const [categories, setCategories] = useState<ProductCategories>([]);
  useEffect(() => {
    const getProductCategories = async () => {
      try {
        const data = await listProductCategories();
        setCategories(data);
      } catch (error) {
        console.error("error fetching categories:", error);
      }
    };
    getProductCategories();
  }, []);

  return (
    <div style={{ flexGrow: 1, marginTop: 70 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Search productCategories={categories} />
          <Categories categories={categories} />
        </Grid>
      </Grid>
    </div>
  );
};
export default Home;
