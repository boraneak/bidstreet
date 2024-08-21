import express from "express";
import { authServices } from "../services/index";

const router = express.Router();

router.post("/signin", authServices.signin);
router.get("/signout", authServices.signout);

export default router;
