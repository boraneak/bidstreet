import React from "react";
import {
  Typography,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import { Link } from "react-router-dom";

import { Product } from "../services/productAPI";

interface ProductsProps {
  products: Product[];
  searched: boolean;
}

const Products: React.FC<ProductsProps> = (props) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        overflow: "hidden",
        background: "lightgray",
        textAlign: "left",
        padding: "0 8px",
      }}
    >
      {props.products && props.products.length > 0 ? (
        <div
          style={{
            minWidth: "100%",
            paddingBottom: "14px",
          }}
        >
          <ImageList cols={3} rowHeight={255}>
            {props.products &&
              props.products.map((product, i) => (
                <ImageListItem key={i}>
                  <img
                    style={{ height: "100%" }}
                    src={`http://localhost:9000/api/v1/products/photo/${product._id}`}
                    alt={product.name}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={
                      <Link
                        to={`http://localhost:9000/api/v1/products/photo/${product._id}`}
                        style={{
                          fontSize: "1.1em",
                          marginBottom: "5px",
                          color: "rgb(189, 222, 219)",
                          display: "block",
                        }}
                      >
                        {product.name}
                      </Link>
                    }
                    subtitle={
                      <span style={{ fontSize: "1.1em" }}>
                        $ {product.price}
                      </span>
                    }
                  />
                </ImageListItem>
              ))}
          </ImageList>
        </div>
      ) : (
        props.searched && (
          <Typography variant="h5" align="center" style={{ color: "red" }}>
            No products found!
          </Typography>
        )
      )}
    </div>
  );
};

export default Products;
