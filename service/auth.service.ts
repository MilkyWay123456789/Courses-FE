import axios from './axiosInstance';
import Cookies from 'js-cookie';

export const login = async (username: string, password: string) => {
  const res = await axios.post('/auth/login', { username, password });
  const token = res.data?.token;

  if (token) Cookies.set('token', token, { expires: 7 });

  return res.data;
};

export const logout = () => {
  Cookies.remove('token');
};
