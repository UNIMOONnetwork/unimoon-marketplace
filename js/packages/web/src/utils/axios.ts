import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.NEXT_APP_API_URL || 'http://194.182.163.50:8090'}/v1`,
  timeout: 15000,
});

instance.interceptors.response.use(response => response);
export default instance;
