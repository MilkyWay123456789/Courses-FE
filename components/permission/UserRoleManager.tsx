'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchAllRoles, Role } from '@/service/role.service'; 

const permissionData = [
  { stt: 1, tenQuyen: 'Báo cáo dịch vụ chi tiết dịch vụ - Xem danh sách', menu: 'Báo cáo dịch vụ' },
  { stt: 2, tenQuyen: 'Báo cáo dịch vụ chi tiết dịch vụ - Xuất excel danh sách', menu: 'Báo cáo dịch vụ' },
  // Thêm các dòng dữ liệu khác từ ảnh
];

export default function UserRoleManager() {
  const [activeMenu, setActiveMenu] = useState('permission');
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState<Role[]>([]); // State để lưu danh sách roles
  const [isLoadingRoles, setIsLoadingRoles] = useState(false); // State cho trạng thái loading (tùy chọn)
  const [selectedRole, setSelectedRole] = useState(''); // State lưu giá trị role đang chọn trong Select

  // Gọi API khi component được mount lần đầu
  useEffect(() => {
    const loadRoles = async () => {
      setIsLoadingRoles(true); // Bắt đầu loading
      try {
        const fetchedRoles = await fetchAllRoles();
        setRoles(fetchedRoles); // Lưu roles vào state
      } catch (error) {
        // Có thể thêm state để hiển thị lỗi cho người dùng
        console.error("Failed to load roles:", error);
      } finally {
        setIsLoadingRoles(false); // Kết thúc loading
      }
    };

    loadRoles();
  }, []); // Mảng dependency rỗng nghĩa là chỉ chạy 1 lần sau khi mount

  return (
    <div className="flex h-screen bg-gray-100">
        {/* Nội dung chính */}
        <div className="flex-1 overflow-auto">
            {/* Bảng phân quyền */}
            <div className="bg-white shadow-md overflow-hidden p-4">
                {/* Thanh công cụ*/}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                    <Input
                        placeholder="Tìm kiếm tài khoản..."
                        className="w-64 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded-md">
                    Lưu thay đổi
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Bảng tài khoản */}
                    <div className="overflow-x-auto">
                        <div className="rounded-t-xl overflow-hidden border border-gray-300">
                            <table className="w-full border-collapse table-auto">
                            <thead className="bg-gray-50">
                                <tr className="border-b border-gray-300">
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase w-[60px] border-r border-gray-300">
                                    STT
                                </th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase w-[40%] border-r border-gray-300">
                                    Tên nhóm
                                </th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {roles.map((role, index) => (
                                <tr key={role._id} className="hover:bg-gray-50">
                                    <td className="p-3 text-sm text-gray-600 border-r border-gray-300 w-[60px]">{index + 1}</td>
                                    <td className="p-3 text-sm font-medium text-gray-800 border-r border-gray-300 w-[40%]">
                                    {role.name}
                                    </td>
                                    <td className="p-3 text-sm font-medium text-gray-800">{role.description}</td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bảng quyền */}
                    <div className="overflow-x-auto">
                        <div className="rounded-t-xl overflow-hidden border border-gray-300">
                            <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase w-[60px]">STT</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Tên quyền</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Menu</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase w-[80px]">Hiệu lực</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase w-[80px]">Reset MK</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {permissionData.map((permission) => (
                                <tr key={permission.stt} className="hover:bg-gray-50">
                                    <td className="p-3 text-sm text-gray-600 w-[60px]">{permission.stt}</td>
                                    <td className="p-3 text-sm text-gray-600">{permission.tenQuyen}</td>
                                    <td className="p-3 text-sm text-gray-600">{permission.menu}</td>
                                    <td className="p-3 text-sm w-[80px]">
                                    <div className="flex items-center justify-center">
                                        <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        defaultChecked
                                        />
                                    </div>
                                    </td>
                                    <td className="p-3 text-sm w-[80px] text-center">
                                    <button className="text-gray-500 hover:text-gray-700">
                                        <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                        </svg>
                                    </button>
                                    </td>
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
  );
}

// Component Select và SelectItem
function Select({
    children,
    value,
    onValueChange,
    className = "",
    disabled = false 
  }: { 
    children: React.ReactNode;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    disabled?: boolean; 
  }) {
    return (
      <select
        className={`border rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        disabled={disabled} // Prop này được sử dụng ở đây
      >
        {children}
      </select>
    );
  }

// SelectItem đã có 'disabled' trong type definition rồi nên không cần sửa
function SelectItem({ children, value, disabled = false }: { children: React.ReactNode; value: string; disabled?: boolean }) {
    return <option value={value} disabled={disabled}>{children}</option>;
}