import axios from 'axios';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to handle API errors
export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    throw new ApiError(
      error.response?.status || 500,
      error.response?.data?.message || 'An unexpected error occurred',
    );
  }
  throw error;
};
