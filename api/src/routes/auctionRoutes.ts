import express from 'express';
import { authServices, userServices, auctionServices } from '../services/index';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post(
  '/create/by/:userId',
  upload.single('image'),
  authServices.hasAuthorization,
  userServices.isSeller,
  auctionServices.createAuction,
);

router.get(
  '/list/by/:userId',
  authServices.hasAuthorization,
  auctionServices.getAuctionBySeller,
);

router.get(
  '/open-auctions',
  authServices.hasAuthorization,
  auctionServices.getOpenAuctions,
);

router.get(
  '/bidder/:userId',
  authServices.hasAuthorization,
  auctionServices.getAuctionByBidder,
);
router.get('/', auctionServices.getAllAuctions);
router.get(
  '/:auctionId',
  authServices.hasAuthorization,
  auctionServices.getAuctionById,
);

router.put(
  '/update/:auctionId',
  upload.single('image'),
  authServices.hasAuthorization,
  userServices.isSeller,
  auctionServices.updateAuctionById,
);

router.delete(
  '/delete/:auctionId',
  authServices.hasAuthorization,
  userServices.isSeller,
  auctionServices.deleteAuctionById,
);

router.get(
  '/img/:auctionId',
  authServices.hasAuthorization,
  auctionServices.getAuctionPhoto,
);

export default router;
