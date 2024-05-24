import express from "express";
import { authServices } from "../services/index";

const router = express.Router();

router.post("/signin", authServices.signIn);
router.get("/signout", authServices.signOut);

export default router;
