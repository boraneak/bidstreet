import express from "express";
import { shopServices, authServices, userServices } from "../services/index";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/", shopServices.getAllShops);

router.post(
  "/create/by/:userId",
  upload.single("image"),
  authServices.hasAuthorization,
  userServices.isSeller,
  shopServices.createShop,
);

router.get(
  "/list/owner/:userId",
  authServices.hasAuthorization,
  shopServices.getShopByOwner,
);

router.put(
  "/update/:shopId",
  upload.single("image"),
  authServices.hasAuthorization,
  shopServices.isShopOwner,
  shopServices.updateShopById,
);

router.delete(
  "/delete/:shopId",
  authServices.hasAuthorization,
  shopServices.isShopOwner,
  shopServices.deleteShopById,
);

router.get("/photo/:shopId", shopServices.getShopPhoto);

router.get("/list/:shopId", shopServices.getShopById);

export default router;
