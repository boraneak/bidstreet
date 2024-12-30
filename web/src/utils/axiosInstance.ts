import axios from 'axios';

const fetchCsrfToken = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_REACT_APP_CSRF_TOKEN_BASE_URL}/csrf-token`,
      {
        withCredentials: true,
      },
    );
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
};

const axiosInstance = async () => {
  const csrfToken = await fetchCsrfToken();
  console.log('CSRF token:', csrfToken);
  if (csrfToken) {
    return axios.create({
      baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL,
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      withCredentials: true,
    });
  } else {
    throw new Error('CSRF token is missing');
  }
};

export default axiosInstance;
