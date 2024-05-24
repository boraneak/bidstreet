import express from "express";
import { userServices } from "../services/index";

const router = express.Router();

router.post("/create", userServices.create);

export default router;
