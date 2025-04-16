// app/template.tsx (Giữ sidebar khi chuyển route)
'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '../components/silebar';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Không hiển thị sidebar ở trang login
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 ml-64">
        {children}
      </main>
    </div>
  );
}