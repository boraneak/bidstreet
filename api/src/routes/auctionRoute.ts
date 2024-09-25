import express from 'express';
import multer from 'multer';
import hasAuthorization from 'middlewares/hasAuthorization';
import controllers from 'controllers/index';
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post(
  '/create/by/:userId',
  upload.single('image'),
  hasAuthorization,
  controllers.user.isSeller,
  controllers.auction.createAuction,
);

router.get(
  '/list/by/:userId',
  hasAuthorization,
  controllers.auction.getAuctionsBySeller,
);

router.get(
  '/open-auctions',
  hasAuthorization,
  controllers.auction.getOpenAuctions,
);

router.get(
  '/bidder/:userId',
  hasAuthorization,
  controllers.auction.getAuctionsByBidder,
);
router.get('/', controllers.auction.getAllAuctions);
router.get('/:auctionId', hasAuthorization, controllers.auction.getAuctionById);

router.put(
  '/update/:auctionId',
  upload.single('image'),
  hasAuthorization,
  controllers.user.isSeller,
  controllers.auction.updateAuctionById,
);

router.delete(
  '/delete/:auctionId',
  hasAuthorization,
  controllers.user.isSeller,
  controllers.auction.deleteAuctionById,
);

router.get(
  '/img/:auctionId',
  hasAuthorization,
  controllers.auction.getAuctionPhoto,
);

export default router;
