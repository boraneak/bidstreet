import express from 'express';
import controllers from 'controllers/index';

import multer from 'multer';
import hasAuthorization from 'middleware/hasAuthorization';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.get('/', controllers.shop.getAllShops);

router.post(
  '/create/by/:userId',
  upload.single('image'),
  hasAuthorization,
  controllers.user.isSeller,
  controllers.shop.createShop,
);

router.get(
  '/list/owner/:userId',
  hasAuthorization,
  controllers.shop.getShopByOwner,
);

router.put(
  '/update/:shopId',
  upload.single('image'),
  hasAuthorization,
  controllers.shop.isShopOwner,
  controllers.shop.updateShopById,
);

router.delete(
  '/delete/:shopId',
  hasAuthorization,
  controllers.shop.isShopOwner,
  controllers.shop.deleteShopById,
);

router.get('/photo/:shopId', controllers.shop.getShopPhoto);

router.get('/list/:shopId', controllers.shop.getShopById);

export default router;
