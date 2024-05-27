import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import shopRoutes from "./shopRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/shops", shopRoutes);

export default router;
