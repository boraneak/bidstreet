import express from 'express';
import { shopServices, userServices } from 'services/index';
import hasAuthorization from 'middleware/hasAuthorization';
import controllers from 'controllers/index';

import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post(
  '/create/by/:shopId',
  upload.single('image'),
  hasAuthorization,
  userServices.isSeller,
  shopServices.isShopOwner,
  controllers.product.createProduct,
);

router.get(
  '/list/:productId',
  hasAuthorization,
  controllers.product.getProductById,
);

router.get(
  '/photo/:productId',
  // authServices.hasAuthorization,
  controllers.product.getProductPhoto,
);

router.put(
  '/update/:shopId/:productId',
  upload.single('image'),
  hasAuthorization,
  shopServices.isShopOwner,
  controllers.product.updateProductById,
);

router.delete(
  '/delete/:shopId/:productId',
  hasAuthorization,
  shopServices.isShopOwner,
  controllers.product.deleteProductById,
);
router.get('/', controllers.product.getAllProducts);
router.get('/search', controllers.product.getFilteredProducts);
router.get('/list/by/:shopId', controllers.product.getProductByShop);
router.get('/latest', controllers.product.getLatestProducts);
router.get('/related/:productId', controllers.product.getRelatedProducts);
router.get('/categories', controllers.product.getProductCategories);

export default router;
