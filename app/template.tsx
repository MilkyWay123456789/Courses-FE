'use client';

import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../components/silebar';
import { logout } from '@/service/auth.service';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true); // đánh dấu đã ở client
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  // Nếu chưa ở client thì return null hoặc loading
  if (!hasMounted) return null;

  // Bỏ layout nếu đang ở login/register
  if (pathname === '/login' || pathname === '/register') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await logout();
    toast.success('Logout thành công 🎉');
    router.push('/login');
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <div className="flex justify-end items-center h-16 px-6 shadow bg-white border-b border-gray-300">
          <span className="mr-4 text-gray-700 font-medium">👋 {username}</span>

          <div className="relative group">
            <button
              onClick={handleLogout}
              className={`
                flex items-center overflow-hidden
                bg-red-500 hover:bg-red-600 text-white py-2 rounded-full transition-all duration-300 ease-in-out
                w-10 group-hover:w-32 px-2 group-hover:px-4
              `}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V7m-5 5H3"
                />
              </svg>

              <span
                className={`
                  opacity-0 group-hover:opacity-100 ml-2 transition-opacity duration-300 whitespace-nowrap
                `}
              >
                Logout
              </span>
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
