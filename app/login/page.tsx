'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/service/auth.service';
import { toast } from 'react-toastify'

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    try {
      const data = await login(username, password);
      toast.success('Đăng nhập thành công 🎉');
  
      // Delay 1 chút để người dùng kịp thấy toast
      setTimeout(() => {
        router.push('/main');
      }, 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại 😥');
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-300">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-center text-2xl font-semibold mb-6">Đăng nhập</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Tên tài khoản</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên tài khoản hoặc email"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full px-4 py-2 mt-1 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                👁️
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          <div className="text-sm text-center text-gray-600">
            Bạn chưa đăng ký sử dụng?{' '}
            <a href="#" className="text-blue-500 hover:underline">
              Đăng ký
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            ĐĂNG NHẬP
          </button>
        </div>
      </form>
    </div>
  );
}
