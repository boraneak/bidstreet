import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import { searchProduct } from "../../API/productAPI";
import { Product } from "../../types/Product";

import {
  Card,
  MenuItem,
  Button,
  TextField,
  Divider,
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Products from "./Products";

interface SearchProps {
  productCategories: string[];
}

const Search: React.FC<SearchProps> = (props) => {
  const [values, setValues] = useState({
    category: "",
    productName: "",
    results: [] as Product[],
    searched: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const handleChange =
    (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setValues({
        ...values,
        [name]: event.target.value,
      });
    };

  const searchProducts = async () => {
    setLoading(true);
    if (abortController) {
      abortController.abort();
    }
    const newAbortController = new AbortController();
    setAbortController(newAbortController);

    try {
      const data = await searchProduct(
        {
          productName: values.productName || "",
          category: values.category,
        },
        newAbortController.signal,
      );
      setValues({ ...values, results: data, searched: true });
    } catch (error) {
      console.error("error searching products", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = () => {
    setValues({
      category: "",
      productName: "",
      results: [],
      searched: false,
    });
  };

  const enterKey = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (values.productName) {
        searchProducts();
      }
    }
  };

  return (
    <Card style={{ margin: "auto", marginTop: 20, padding: 16 }}>
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item xs={12} sm={5}>
          <TextField
            id="category"
            select
            label="Select category"
            value={values.category}
            onChange={handleChange("category")}
            fullWidth
            margin="normal"
          >
            {props.productCategories &&
              props.productCategories.map((category, i) => (
                <MenuItem key={i} value={category}>
                  {category}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            id="product"
            label="Enter product name"
            value={values.productName}
            onKeyDown={enterKey}
            onChange={handleChange("productName")}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={1}>
          <Button
            color="primary"
            onClick={searchProducts}
            disabled={!values.category && !values.productName}
            sx={{ height: "56px" }}
          >
            <SearchIcon sx={{ fontSize: 55 }} />
          </Button>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Button
            color="secondary"
            onClick={clearFilter}
            disabled={!values.category && !values.productName}
            sx={{ height: "56px" }}
          >
            <ClearIcon sx={{ fontSize: 55 }} />
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ marginY: 2 }} />
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Products products={values.results} searched={values.searched} />
      )}
    </Card>
  );
};

export default Search;
