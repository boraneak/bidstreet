import express from 'express';
import { userServices } from '../services/index';
import hasAuthorization from 'middleware/hasAuthorization';

const router = express.Router();

router.get('/list', hasAuthorization, userServices.getAllUsers);

router.get('/profile/:userId', hasAuthorization, userServices.readUserProfile);

router.put('/update/:userId', hasAuthorization, userServices.updateUserById);
router.delete('/delete/:userId', hasAuthorization, userServices.deleteUserById);
router.get('/:userId', userServices.getUserById);
export default router;
