import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.NEXT_APP_API_URL || 'http://194.182.163.50:8090'}/v1`,
  timeout: 15000,
});

instance.interceptors.request.use(req => {
  req.headers['api-key'] = 'Tv+4Cfd/d9raNuCVu2zLsg==';
  return req;
});
instance.interceptors.response.use(response => response);
export default instance;

export const decryptResponse = (response: string) => {
  return '';
};
