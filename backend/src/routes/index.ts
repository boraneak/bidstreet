import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import shopRoutes from "./shopRoutes";
import productRoutes from "./productRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/shops", shopRoutes);
router.use("/products", productRoutes);

export default router;
