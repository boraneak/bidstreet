import express from 'express';

import hasAuthorization from 'middleware/hasAuthorization';
import services from 'services/index';

const router = express.Router();

router.post(
  '/create/:userId',
  hasAuthorization,
  services.order.createOrderService,
);

router.get(
  '/shop/:shopId',
  hasAuthorization,
  services.shop.isShopOwner,
  services.order.getOrdersByShopService,
);

router.get(
  '/user/:userId',
  hasAuthorization,
  services.order.getOrdersByUserService,
);

router.get(
  '/status-values',
  hasAuthorization,
  services.order.getOrderStatusValuesService,
);

router.get(
  '/list/:orderId',
  hasAuthorization,
  services.order.getOrderByIdService,
);

export default router;
