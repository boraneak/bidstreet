import express from 'express';
import { authServices } from 'services/index';

const router = express.Router();

router.post('/signup', authServices.signUp);
router.post('/signin', authServices.signIn);

export default router;
