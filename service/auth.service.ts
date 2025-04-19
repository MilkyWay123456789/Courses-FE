import axios from './axiosInstance';
import Cookies from 'js-cookie';

export const login = async (email: string, password: string) => {
  const res = await axios.post('/auth/login', { email, password });
  const token = res.data?.token;

  if (token) Cookies.set('access-token', token, { expires: 7 });

  return res.data;
};

export const logout = () => {
  Cookies.remove('access-token');
};
