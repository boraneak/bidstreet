import express from 'express';
import { shopServices, userServices } from 'services/index';
import multer from 'multer';
import hasAuthorization from 'middleware/hasAuthorization';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.get('/', shopServices.getAllShops);

router.post(
  '/create/by/:userId',
  upload.single('image'),
  hasAuthorization,
  userServices.isSeller,
  shopServices.createShop,
);

router.get(
  '/list/owner/:userId',
  hasAuthorization,
  shopServices.getShopByOwner,
);

router.put(
  '/update/:shopId',
  upload.single('image'),
  hasAuthorization,
  shopServices.isShopOwner,
  shopServices.updateShopById,
);

router.delete(
  '/delete/:shopId',
  hasAuthorization,
  shopServices.isShopOwner,
  shopServices.deleteShopById,
);

router.get('/photo/:shopId', shopServices.getShopPhoto);

router.get('/list/:shopId', shopServices.getShopById);

export default router;
