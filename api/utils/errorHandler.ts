import { Response } from 'express';

export const handleError = (
  res: Response,
  error: any,
  customMessage?: string,
) => {
  console.log(customMessage || 'An unexpected error occurred', error);
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  return res.status(statusCode).json({ error: message });
};
