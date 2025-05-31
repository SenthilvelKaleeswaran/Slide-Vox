import axios from 'axios';

const BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT = 10000;
const RETRY_COUNT = 0;

const fetchWrapper = async (method, url, body = null, options = {}, retries = RETRY_COUNT) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...((options as { headers?: Record<string, string> }).headers || {}),
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    url: BASE_URL + url,
    headers,
    timeout: (options as { timeout?: number }).timeout || DEFAULT_TIMEOUT,
    data: body,
    ...options,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    const isRetryable = error.code === 'ECONNABORTED' || error.response?.status >= 500;

    if (retries > 0 && isRetryable) {
      return fetchWrapper(method, url, body, options, retries - 1);
    }

    throw {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
  }
};

export default fetchWrapper;
