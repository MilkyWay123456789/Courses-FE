'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const menuItems = [
  { id: 'system', name: 'Hệ thống', icon: '⚙️' },
  { id: 'employee', name: 'Nhân viên', icon: '👨‍💼' },
  { id: 'permission', name: 'Cấp quyền', icon: '🔑' },
  { id: 'group', name: 'Nhóm quyền', icon: '👥' },
];

// Dữ liệu mẫu từ ảnh bạn cung cấp
const userData = [
  { stt: 1, taiKhoan: 'TRUCTEST_VHD', maNhanVien: 'TRUCTEST_VHDI', nhomQuyen: 'Tùy chính', hieuLuc: '' },
  { stt: 2, taiKhoan: 'TRUCTEST_BSTCM', maNhanVien: 'TRUCTEST_BSTCM', nhomQuyen: 'Tùy chính', hieuLuc: '' },
  // Thêm các dòng dữ liệu khác từ ảnh
];

const permissionData = [
  { stt: 1, tenQuyen: 'Báo cáo dịch vụ chi tiết dịch vụ - Xem danh sách', menu: 'Báo cáo dịch vụ' },
  { stt: 2, tenQuyen: 'Báo cáo dịch vụ chi tiết dịch vụ - Xuất excel danh sách', menu: 'Báo cáo dịch vụ' },
  // Thêm các dòng dữ liệu khác từ ảnh
];

export default function UserRoleManager() {
  const [activeMenu, setActiveMenu] = useState('permission');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Thanh menu xanh pastel bên trái (giữ nguyên) */}
      <div className="w-64 bg-blue-100 text-blue-900 p-4 flex flex-col rounded-r-2xl">
        <h1 className="text-xl font-bold mb-6 pl-2">Courses</h1>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  className={`w-full text-left p-3 rounded-full flex items-center transition-colors ${
                    activeMenu === item.id ? 'bg-blue-200 text-blue-800 font-medium' : 'hover:bg-blue-50'
                  }`}
                  onClick={() => setActiveMenu(item.id)}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
            <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Cấp quyền</h2>
            </div>
        </header>

        {/* Nội dung chính */}
        <div className="flex-1 overflow-auto p-4">
            {/* Thanh công cụ */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                <Input
                    placeholder="Tìm kiếm..."
                    className="w-64 rounded-full border-gray-300 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select className="min-w-[180px]">
                    <SelectItem value="">Tất cả nhóm quyền</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                </Select>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 px-4 py-2">
                Lưu thay đổi
                </Button>
            </div>
            </div>

            {/* Bảng phân quyền */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="grid grid-cols-2">
                    {/* Bảng tài khoản */}
                    <div className="overflow-x-auto p-2 my-2">
                        <div className="rounded-t-xl overflow-hidden border border-gray-300">
                            <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                <th className="p-3 text-left text-sm font-medium text-gray-500">STT</th>
                                <th className="p-3 text-left text-sm font-medium text-gray-500">Tài khoản</th>
                                <th className="p-3 text-left text-sm font-medium text-gray-500">Mã nhân viên</th>
                                <th className="p-3 text-left text-sm font-medium text-gray-500">Nhóm quyền</th>
                                <th className="p-3 text-left text-sm font-medium text-gray-500">Hiệu lực</th>
                                <th className="p-3 text-left text-sm font-medium text-gray-500">Reset MK</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {userData.map((user) => (
                                <tr key={user.stt} className="hover:bg-gray-50">
                                    <td className="p-3 text-sm text-gray-600">{user.stt}</td>
                                    <td className="p-3 text-sm font-medium text-gray-800">{user.taiKhoan}</td>
                                    <td className="p-3 text-sm text-gray-600">{user.maNhanVien}</td>
                                    <td className="p-3 text-sm text-gray-600">{user.nhomQuyen}</td>
                                    <td className="p-3 text-sm">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    </td>
                                    <td className="p-3 text-sm">
                                    <button className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium">
                                        Reset MK
                                    </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        </div>

                    {/* Bảng quyền */}
                    <div className="overflow-x-auto p-2 my-2">
                        <div className="rounded-t-xl overflow-hidden border border-gray-300">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3 text-left text-sm font-medium text-gray-500">STT</th>
                                    <th className="p-3 text-left text-sm font-medium text-gray-500">Tên quyền</th>
                                    <th className="p-3 text-left text-sm font-medium text-gray-500">Menu</th>
                                </tr>
                                </thead>
                                <tbody className="divide-gray-200">
                                {permissionData.map((permission) => (
                                    <tr key={permission.stt} className="hover:bg-gray-50">
                                    <td className="p-3 text-sm text-gray-600">{permission.stt}</td>
                                    <td className="p-3 text-sm">
                                        <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                        />
                                        <span className="text-gray-800">{permission.tenQuyen}</span>
                                        </div>
                                    </td>
                                    <td className="p-3 text-sm text-gray-600">{permission.menu}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
      
    </div>
  );
}

// Component Select đã được sửa
function Select({ 
    children, 
    value, 
    onValueChange, 
    className = "" 
  }: { 
    children: React.ReactNode; 
    value?: string; 
    onValueChange?: (value: string) => void;
    className?: string;
  }) {
    return (
      <select 
        className={`border rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
      >
        {children}
      </select>
    );
  }
  
  function SelectItem({ children, value }: { children: React.ReactNode; value: string }) {
    return <option value={value}>{children}</option>;
  }