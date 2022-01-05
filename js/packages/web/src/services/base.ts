import axios from 'axios';

const instance = axios.create({
  baseURL: `${
    process.env.NEXT_APP_API_URL || 'http://localhost:4000'
  }/api`,
  timeout: 15000,
});

instance.interceptors.response.use(response => response);
export default instance;
