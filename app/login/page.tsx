'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/service/auth.service';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(username, password);
      router.push('/admin'); // chuyển về dashboard
    } catch (err) {
      alert('Đăng nhập thất bại');
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl mb-4">Đăng nhập</h2>
      <input placeholder="Username" className="mb-2 p-2 border w-full" onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" className="mb-4 p-2 border w-full" onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-blue-500 text-white px-4 py-2 w-full" onClick={handleLogin}>
        Đăng nhập
      </button>
    </div>
  );
}
