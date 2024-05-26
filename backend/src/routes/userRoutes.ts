import express from "express";
import { userServices } from "../services/index";
import { authServices } from "../services/index";
const router = express.Router();

router.get("/list", authServices.hasAuthorization, userServices.getAllUsers);
router.post("/create", userServices.createUser);

router.get(
  "/profile/:userId",
  authServices.hasAuthorization,
  userServices.readUserProfile
);

router.put(
  "/update/:userId",
  authServices.hasAuthorization,
  userServices.updateUserById
);
router.delete(
  "/delete/:userId",
  authServices.hasAuthorization,
  userServices.deleteUserById
);
router.get("/:userId", userServices.getUserById);
export default router;
