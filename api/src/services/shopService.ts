import mongoose from 'mongoose';
import Shop from 'models/shopModel';
import fs from 'fs';
import { IShop } from 'interfaces/Shop';
import path from 'path';

const defaultImagePath = path.join(
  __dirname,
  'public/images/defaultShopImage.jpg',
);

export const createShopService = async (
  userId: string,
  shopData: IShop,
  imageFile?: Express.Multer.File,
) => {
  let imageData;
  if (imageFile) {
    const safeDir = path.resolve(__dirname, 'uploads'); // Assuming 'uploads' is the intended directory
    const resolvedPath = path.resolve(safeDir, imageFile.path);
    if (!resolvedPath.startsWith(safeDir)) {
      throw new Error('Invalid file path');
    }
    imageData = fs.readFileSync(resolvedPath);
  }

  const shop = new Shop({
    ...shopData,
    owner: new mongoose.Types.ObjectId(userId),
    image: imageFile
      ? {
          data: imageData,
          contentType: imageFile.mimetype,
        }
      : null,
  });

  return await shop.save();
};

export const getShopByIdService = async (shopId: string) => {
  return await Shop.findById(shopId).populate('owner', '_id name').exec();
};

export const getShopPhotoService = async (shopId: string) => {
  const shop = await Shop.findById(shopId);

  if (shop && shop.image && shop.image.data) {
    return { imageData: shop.image.data, contentType: shop.image.contentType };
  } else {
    return defaultImagePath;
  }
};

export const updateShopByIdService = async (
  shopId: string,
  updateData: any,
  imageFile?: Express.Multer.File,
) => {
  const shop = await Shop.findOne({ _id: shopId });

  if (shop) {
    // Update image if a new file is uploaded
    if (imageFile) {
      const safeDir = path.resolve(__dirname, 'uploads'); // Assuming 'uploads' is the intended directory
      const resolvedPath = path.resolve(safeDir, imageFile.path);
      if (!resolvedPath.startsWith(safeDir)) {
        throw new Error('Invalid file path');
      }
      const imageData = fs.readFileSync(resolvedPath);
      shop.image = {
        data: imageData,
        contentType: imageFile.mimetype,
      };
    }

    shop.set({ ...updateData });
    return await shop.save();
  }

  return null;
};

export const deleteShopByIdService = async (shopId: string) => {
  return await Shop.findByIdAndDelete(shopId);
};

export const getAllShopsService = async () => {
  return await Shop.find();
};

export const getShopByOwnerService = async (ownerId: string) => {
  return await Shop.find({ owner: ownerId })
    .populate('owner', '_id name')
    .exec();
};

export const isShopOwnerService = async (userId: string) => {
  return await Shop.findOne({ owner: userId });
};
