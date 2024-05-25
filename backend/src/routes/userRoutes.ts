import express from "express";
import { userServices } from "../services/index";
import { verifyUserToken } from "../../middlewares/verifyUserToken";

const router = express.Router();

router.post("/create", userServices.create);
router.get("/list", verifyUserToken, userServices.list);
router.get("/list/:id", verifyUserToken, userServices.getUserById);
router.put("/update/:id", verifyUserToken, userServices.updateUserById);
router.delete("/delete/:id", verifyUserToken, userServices.deleteUserById);

export default router;
