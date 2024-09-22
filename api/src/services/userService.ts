import User from 'models/userModel';
import sanitize from 'mongo-sanitize';

export const getUserByIdService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const readUserProfileService = async (userId: string) => {
  const user = await User.findById(userId, { hashed_password: 0, salt: 0 });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const getAllUsersService = async () => {
  return await User.find();
};

export const updateUserByIdService = async (
  userId: string,
  updateData: any,
) => {
  // Validate updateData to ensure it does not contain any malicious content
  if (typeof updateData !== 'object' || Array.isArray(updateData)) {
    throw new Error('Invalid update data');
  }

  const sanitizedUpdateData = sanitize(updateData);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: sanitizedUpdateData },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedUser) {
    throw new Error('User not found');
  }

  return updatedUser;
};

export const deleteUserByIdService = async (userId: string) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new Error('User not found');
  }

  return deletedUser;
};
