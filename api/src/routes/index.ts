import express from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import shopRoutes from './shopRoutes';
import productRoutes from './productRoutes';
import orderRoutes from './orderRoutes';
import auctionRoutes from './auctionRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/shops', shopRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/auctions', auctionRoutes);

export default router;
