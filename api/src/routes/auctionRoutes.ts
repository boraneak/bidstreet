import express from 'express';
import { userServices, auctionServices } from '../services/index';
import multer from 'multer';
import hasAuthorization from 'middleware/hasAuthorization';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post(
  '/create/by/:userId',
  upload.single('image'),
  hasAuthorization,
  userServices.isSeller,
  auctionServices.createAuction,
);

router.get(
  '/list/by/:userId',
  hasAuthorization,
  auctionServices.getAuctionBySeller,
);

router.get('/open-auctions', hasAuthorization, auctionServices.getOpenAuctions);

router.get(
  '/bidder/:userId',
  hasAuthorization,
  auctionServices.getAuctionByBidder,
);
router.get('/', auctionServices.getAllAuctions);
router.get('/:auctionId', hasAuthorization, auctionServices.getAuctionById);

router.put(
  '/update/:auctionId',
  upload.single('image'),
  hasAuthorization,
  userServices.isSeller,
  auctionServices.updateAuctionById,
);

router.delete(
  '/delete/:auctionId',
  hasAuthorization,
  userServices.isSeller,
  auctionServices.deleteAuctionById,
);

router.get(
  '/img/:auctionId',
  hasAuthorization,
  auctionServices.getAuctionPhoto,
);

export default router;
