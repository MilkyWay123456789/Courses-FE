// components/ui/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cog, User, Key, Users } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-blue-50 text-black h-full fixed left-0 top-0 p-3">
      <h1 className="text-xl font-bold mb-8">Quản lý người dùng & quyền</h1>
      
      <div className="mb-6">
        <h2 className="text-base font-semibold mb-2 text-gray-700">Courses</h2>
        <ul className="space-y-1">
          <li>
            <Link
              href="/main"
              className={`flex items-center p-2 rounded ${
                pathname === '/main' ? 'bg-blue-200' : 'hover:bg-blue-100'
              }`}
            >
              <Cog className="w-5 h-5 mr-2" />
              Hệ thống
            </Link>
          </li>
          <li>
            <Link
              href="/main/user"
              className={`flex items-center p-2 rounded ${
                pathname.startsWith('/main/user') ? 'bg-blue-200' : 'hover:bg-blue-100'
              }`}
            >
              <User className="w-5 h-5 mr-2" />
              Nhân viên
            </Link>
          </li>
          <li>
            <Link
              href="/main/group"
              className={`flex items-center p-2 rounded ${
                pathname.startsWith('/main/group') ? 'bg-blue-200' : 'hover:bg-blue-100'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Nhóm người dùng
            </Link>
          </li>
          <li>
            <Link
              href="/main/permission"
              className={`flex items-center p-2 rounded ${
                pathname.startsWith('/main/permission') ? 'bg-blue-300' : 'hover:bg-blue-100'
              }`}
            >
              <Key className="w-5 h-5 mr-2" />
              Cấp quyền
            </Link>
          </li>
          <li>
            <Link
              href="/main/role"
              className={`flex items-center p-2 rounded ${
                pathname.startsWith('/main/role') ? 'bg-blue-200' : 'hover:bg-blue-100'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Nhóm quyền
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}