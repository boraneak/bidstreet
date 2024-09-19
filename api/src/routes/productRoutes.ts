import express from 'express';
import {
  shopServices,
  authServices,
  userServices,
  productServices,
} from '../services/index';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post(
  '/create/by/:shopId',
  upload.single('image'),
  authServices.hasAuthorization,
  userServices.isSeller,
  shopServices.isShopOwner,
  productServices.createProduct,
);

router.get(
  '/list/:productId',
  authServices.hasAuthorization,
  productServices.getProductById,
);

router.get(
  '/photo/:productId',
  // authServices.hasAuthorization,
  productServices.getProductPhoto,
);

router.put(
  '/update/:shopId/:productId',
  upload.single('image'),
  authServices.hasAuthorization,
  shopServices.isShopOwner,
  productServices.updateProductById,
);

router.delete(
  '/delete/:shopId/:productId',
  authServices.hasAuthorization,
  shopServices.isShopOwner,
  productServices.deleteProductById,
);
router.get('/', productServices.getAllProducts);
router.get('/search', productServices.getFilteredProducts);
router.get('/list/by/:shopId', productServices.getProductByShop);
router.get('/latest', productServices.getLatestProducts);
router.get('/related/:productId', productServices.getRelatedProducts);
router.get('/categories', productServices.getProductCategories);

export default router;
