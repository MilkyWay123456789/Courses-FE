'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/service/auth.service';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPass) {
      setError('Mật khẩu không khớp');
      toast.error('Mật khẩu không khớp ❌');
      return;
    }

    try {
      await register(email, password);
      toast.success('Đăng ký thành công 🎉');
      setTimeout(() => {
        router.push('/main');
      }, 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại 😥');
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-green-200">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-center text-2xl font-semibold mb-6">Đăng ký</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tên người dùng</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên người dùng"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
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
                className="w-full px-4 py-2 mt-1 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-green-400"
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

          <div>
            <label className="block text-sm font-medium">Nhập lại mật khẩu</label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          <div className="text-sm text-center text-gray-600">
            Đã có tài khoản?{' '}
            <span
              onClick={() => router.push('/login')}
              className="text-green-500 hover:underline cursor-pointer"
            >
              Đăng nhập
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all"
          >
            ĐĂNG KÝ
          </button>
        </div>
      </form>
    </div>
  );
}
