import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import {
  Card,
  MenuItem,
  Button,
  TextField,
  Divider,
  Box,
  CircularProgress,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { Product } from '@/types';
import { ProductGridDisplay } from './product-grid-display';
import { searchProduct } from '../api/search-product';

const useStyles = {
  card: {
    margin: 'auto',
    marginTop: 2,
    padding: 2,
  },
  buttonIcon: {
    fontSize: 55,
  },
  button: {
    height: '56px',
  },
  loadingBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
  },
  divider: {
    marginY: 2,
  },
};

interface ProductSearchPanelProps {
  productCategories: string[];
}
export const ProductSearchPanel: React.FC<ProductSearchPanelProps> = (
  props,
) => {
  const [searchState, setSearchState] = useState({
    category: '',
    productName: '',
    results: [] as Product[],
    searched: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const handleInputChange =
    (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setSearchState({
        ...searchState,
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
          productName: searchState.productName || '',
          category: searchState.category,
        },
        newAbortController.signal,
      );
      setSearchState({ ...searchState, results: data, searched: true });
    } catch (error) {
      console.error('error searching products', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = () => {
    setSearchState({
      category: '',
      productName: '',
      results: [],
      searched: false,
    });
  };

  const handleEnterKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (searchState.productName) {
        searchProducts();
      }
    }
  };

  return (
    <Card sx={useStyles.card}>
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item xs={12} sm={5}>
          <TextField
            id="category"
            select
            label="Select category"
            value={searchState.category}
            onChange={handleInputChange('category')}
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
            value={searchState.productName}
            onKeyDown={handleEnterKeyPress}
            onChange={handleInputChange('productName')}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={1}>
          <Button
            color="primary"
            onClick={searchProducts}
            disabled={!searchState.category && !searchState.productName}
            sx={useStyles.button}
          >
            <SearchIcon sx={useStyles.buttonIcon} />
          </Button>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Button
            color="secondary"
            onClick={clearFilter}
            disabled={!searchState.category && !searchState.productName}
            sx={useStyles.button}
          >
            <ClearIcon sx={useStyles.buttonIcon} />
          </Button>
        </Grid>
      </Grid>
      <Divider sx={useStyles.divider} />
      {loading ? (
        <Box sx={useStyles.loadingBox}>
          <CircularProgress />
        </Box>
      ) : (
        <ProductGridDisplay
          products={searchState.results}
          isSearched={searchState.searched}
        />
      )}
    </Card>
  );
};
