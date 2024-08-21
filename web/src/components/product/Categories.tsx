import React, { useState, useEffect } from "react";
import { Product } from "../services/productAPI";
import {
  Card,
  Typography,
  Grid,
  CardActionArea,
  CardContent,
  Divider,
} from "@mui/material";
import { searchProduct } from "../services/productAPI";
import Products from "./Products";

interface CategoryProps {
  categories: string[];
}

const Categories: React.FC<CategoryProps> = (props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<string>(
    props.categories.length > 0 ? props.categories[0] : ""
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await searchProduct({ category: selected });
        setProducts(data);
      } catch (error) {
        console.error("Error fetching product by selected category:", error);
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
      <Card style={{ margin: "auto", marginTop: 20, padding: 16 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Explore by Category
        </Typography>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          style={{ background: "#fafafa" }}
        >
          {props.categories &&
            props.categories.map((category, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card
                  style={{
                    backgroundColor: selected === category ? "green" : "gray",
                    height: "64px",
                  }}
                >
                  <CardActionArea onClick={listbyCategory(category)}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        style={{
                          color: "white",
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                      >
                        {category}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
        <Divider style={{ margin: "16px 0" }} />
        <Products products={products} searched={false} />
      </Card>
    </div>
  );
};

export default Categories;
