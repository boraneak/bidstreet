import express from 'express';
import authRoute from './authRoute';
import userRoute from './userRoute';
import shopRoutes from './shopRoutes';
import productRoute from './productRoute';
import orderRoutes from './orderRoutes';
import auctionRoute from './auctionRoute';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/shops', shopRoutes);
router.use('/products', productRoute);
router.use('/orders', orderRoutes);
router.use('/auctions', auctionRoute);

export default router;
