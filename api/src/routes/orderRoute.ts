import express from 'express';

import hasAuthorization from 'middlewares/hasAuthorization';
import controllers from 'controllers/index';

const router = express.Router();

router.post('/create/:userId', hasAuthorization, controllers.order.createOrder);

router.get(
  '/shop/:shopId',
  hasAuthorization,
  controllers.shop.isShopOwner,
  controllers.order.getOrderByShop,
);

router.get('/user/:userId', hasAuthorization, controllers.order.getOrderByUser);

router.get(
  '/status-values',
  hasAuthorization,
  controllers.order.getOrderStatusValues,
);

router.get('/list/:orderId', hasAuthorization, controllers.order.getOrderById);

export default router;
