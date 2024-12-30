import React, { CSSProperties } from 'react';

import {
  Typography,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Product } from '@/types';

const useStyles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: 'lightgray',
    textAlign: 'left',
    padding: '0 8px',
  },
  gridWrapper: {
    minWidth: '100%',
    paddingBottom: '14px',
  },
  productImage: {
    height: '100%',
  },
  productLink: {
    fontSize: '1.1em',
    marginBottom: '5px',
    color: 'rgb(189, 222, 219)',
    display: 'block',
  },
  priceText: {
    fontSize: '1.1em',
  },
  noProductsText: {
    color: 'red',
  },
};

interface ProductGridDisplayProps {
  products: Product[];
  isSearched: boolean;
}
export const ProductGridDisplay: React.FC<ProductGridDisplayProps> = ({
  products,
  isSearched,
}) => {
  return (
    <div style={useStyles.container}>
      {products && products.length > 0 ? (
        <div style={useStyles.gridWrapper}>
          <ImageList cols={3} rowHeight={255}>
            {products.map((product, index) => (
              <ImageListItem key={index}>
                <img
                  style={useStyles.productImage}
                  src={`${process.env.REACT_APP_API_BASE_URL}/products/photo/${product._id}`}
                  alt={product.name}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={
                    <Link
                      to={`${process.env.REACT_APP_API_BASE_URL}/products/photo/${product._id}`}
                      style={useStyles.productLink}
                    >
                      {product.name}
                    </Link>
                  }
                  subtitle={
                    <span style={useStyles.priceText}>$ {product.price}</span>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      ) : (
        isSearched && (
          <Typography
            variant="h5"
            align="center"
            style={useStyles.noProductsText}
          >
            No products found!
          </Typography>
        )
      )}
    </div>
  );
};
