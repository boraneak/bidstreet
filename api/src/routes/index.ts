import express from 'express';
import authRoute from './authRoute';
import userRoute from './userRoute';
import shopRoute from './shopRoute';
import productRoute from './productRoute';
import orderRoute from './orderRoute';
import auctionRoute from './auctionRoute';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/shops', shopRoute);
router.use('/products', productRoute);
router.use('/orders', orderRoute);
router.use('/auctions', auctionRoute);

export default router;
