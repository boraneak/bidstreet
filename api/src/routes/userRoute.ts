import express from 'express';
import controllers from 'controllers/index';
import hasAuthorization from 'middleware/hasAuthorization';

const router = express.Router();

router.get('/list', hasAuthorization, controllers.user.getAllUsers);

router.get(
  '/profile/:userId',
  hasAuthorization,
  controllers.user.readUserProfile,
);

router.put(
  '/update/:userId',
  hasAuthorization,
  controllers.user.updateUserById,
);
router.delete(
  '/delete/:userId',
  hasAuthorization,
  controllers.user.deleteUserById,
);
router.get('/:userId', controllers.user.getUserById);
export default router;
