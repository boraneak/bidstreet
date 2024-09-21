import express from 'express';

import { shopServices, orderServices } from '../services/index';
import hasAuthorization from 'middleware/hasAuthorization';

const router = express.Router();

router.post('/create/:userId', hasAuthorization, orderServices.createOrder);

router.get(
  '/shop/:shopId',
  hasAuthorization,
  shopServices.isShopOwner,
  orderServices.getOrderByShop,
);

router.get('/user/:userId', hasAuthorization, orderServices.getOrderByUser);

router.get(
  '/status-values',
  hasAuthorization,
  orderServices.getOrderStatusValues,
);

// router.put("/status/:orderId");
router.get('/list/:orderId', hasAuthorization, orderServices.getOrderById);

export default router;
