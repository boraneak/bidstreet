import express from "express";
import { shopServices, authServices, userServices } from "../services/index";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/", shopServices.getAllShops);

router.post(
  "/create",
  upload.single("image"),
  authServices.hasAuthorization,
  userServices.isSeller,
  shopServices.createShop
);

router.get(
  "/list/owner/:userId",
  authServices.hasAuthorization,
  shopServices.getShopByOwner
);

router.put(
  "/update/:shopId",
  upload.single("image"),
  authServices.hasAuthorization,
  shopServices.updateShopById
);

router.delete(
  "/delete/:shopId",
  authServices.hasAuthorization,
  shopServices.deleteShopById
);

router.get("/logo/:shopId", shopServices.getShopPhoto);

router.get("/list/:shopId", shopServices.getShopById);

export default router;
