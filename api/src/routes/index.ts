import express from 'express';
import authRoutes from './authRoute';
import userRoutes from './userRoutes';
import shopRoutes from './shopRoutes';
import productRoute from './productRoute';
import orderRoutes from './orderRoutes';
import auctionRoute from './auctionRoute';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/shops', shopRoutes);
router.use('/products', productRoute);
router.use('/orders', orderRoutes);
router.use('/auctions', auctionRoute);

export default router;
