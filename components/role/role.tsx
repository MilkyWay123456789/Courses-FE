'use client';
import { useState, useEffect, useRef } from 'react';
import { fetchAllRoles, addRole, Role } from '@/service/role.service'; 
import AddRoleModal from './AddRoleModal';

export default function Roles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

  // Gọi API khi component được mount lần đầu
  useEffect(() => {
    const loadRoles = async () => {
      setIsLoadingRoles(true);
      try {
        const fetchedRoles = await fetchAllRoles();
        setRoles(fetchedRoles);
      } catch (error) {
        console.error("Failed to load roles:", error);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    loadRoles();
  }, []);

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addRole(newRole);
    if (result) {
      setRoles([...roles, result]);
      setNewRole({ name: '', description: '' });
      setIsModalOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRole((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Danh sách Roles</h1>
          <button
            ref={triggerButtonRef} // Thêm ref vào button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Thêm Role mới
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingRoles ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Không có role nào
                  </td>
                </tr>
              ) : (
                roles.map((role, index) => (
                  <tr key={role._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{role.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{role.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{roles.length}</span> trong{' '}
            <span className="font-medium">{roles.length}</span> roles
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              disabled
            >
              Trước
            </button>
            <button
              className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              disabled
            >
              Sau
            </button>
          </div>
        </div>
      </div>
      <AddRoleModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        newRole={newRole}
        handleInputChange={handleInputChange}
        handleAddRole={handleAddRole}
        triggerButtonRef={triggerButtonRef} // Truyền ref vào modal
      />
    </div>
  );
}

// Component Select và SelectItem (giữ nguyên)
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
      disabled={disabled}
    >
      {children}
    </select>
  );
}

function SelectItem({ children, value, disabled = false }: { children: React.ReactNode; value: string; disabled?: boolean }) {
  return <option value={value} disabled={disabled}>{children}</option>;
}