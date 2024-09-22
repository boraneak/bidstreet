import express from 'express';
import controllers from 'controllers/index';
const router = express.Router();

router.post('/signup', controllers.auth.signUp);
router.post('/signin', controllers.auth.signIn);

export default router;
