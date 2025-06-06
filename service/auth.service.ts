import axios from './axiosInstance';
import Cookies from 'js-cookie';

//Hàm gọi api đăng nhập
export const login = async (email: string, password: string) => {
  const res = await axios.post('/auth/login', { email, password });
  const token = res.data?.access_token;

  if (token) Cookies.set('access-token', token, { expires: 7 });
  localStorage.setItem("username", res.data?.user.name);

  return res.data;
};

//hàm gọi api đăng ký
export const register = async (email: string, password: string, name: string) => {
  const res = await axios.post('/auth/register', { email, password, name });
  const token = res.data?.token;

  if (token) Cookies.set('access-token', token, { expires: 7 });

  return res.data;
};

export const logout = () => {
  Cookies.remove('access-token');
  localStorage.removeItem("username");
};
