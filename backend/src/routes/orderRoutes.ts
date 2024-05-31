import express from "express";

import { shopServices, authServices, orderServices } from "../services/index";

const router = express.Router();

router.post(
  "/create/:userId",
  authServices.hasAuthorization,
  orderServices.createOrder
);

router.get(
  "/shop/:shopId",
  authServices.hasAuthorization,
  shopServices.isShopOwner,
  orderServices.getOrderByShop
);

router.get(
  "/user/:userId",
  authServices.hasAuthorization,
  orderServices.getOrderByUser
);

router.get(
  "/status-values",
  authServices.hasAuthorization,
  orderServices.getOrderStatusValues
);

// router.put("/status/:orderId");
router.get(
  "/list/:orderId",
  authServices.hasAuthorization,
  orderServices.getOrderById
);

export default router;
