export interface IMongoError extends Error {
  code?: number;
  keyValue?: Record<string, any>;
  errors?: Record<string, { message: string }>;
}
