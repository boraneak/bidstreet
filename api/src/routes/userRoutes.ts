import express from "express";
import { userServices } from "../services/index";
import { authServices } from "../services/index";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to users
 */

/**
 * @swagger
 * /api/v1/users/list:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   hashed_password:
 *                     type: string
 *                   salt:
 *                     type: string
 *                   seller:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   __v:
 *                     type: integer
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/list", authServices.hasAuthorization, userServices.getAllUsers);

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
