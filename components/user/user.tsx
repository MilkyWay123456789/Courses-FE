'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { fetchAllUser, updateUser, deleteUser, changePassword, User } from '@/service/user.service'; 
import { fetchAllGroup, Group } from '@/service/group.service';
import AddUserModal from './Modal/AddUserModal';
import DeleteModal from './Modal/DeleteModal';
import ChangePasswordModal from './Modal/ChangePasswordModal';
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input';

export default function Users() {
  const [keyword, setKeyword] = useState(''); 
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newuser, setNewUser] = useState({ name: '', email: '', password: '' ,newPassword: '', role: '' });
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const [editinguser, setEditinguser] = useState<User | null>(null);
  const [editingPassword, setEditingPassword] = useState<User | null>(null);
  const [isModalPassOpen, setIsModalPassOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selecteduserId, setSelecteduserId] = useState<string | number>();
  const [groups, setGroups] = useState<Group[]>([]);

  // Debounced fetch function
    const debouncedFetchUsers = useMemo(() => 
    debounce(async (kw: string) => {
      setIsLoadingUsers(true);
      try {
        const response = await fetchAllUser(1, 10, kw);
        setUsers(response.data);
        setTotal(response.total);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    }, 500), // 500ms debounce
  []);
  
  // Effect gọi API khi keyword đổi
  useEffect(() => {
    //Hàm get all group
    const loadGroups = async () => {
        const data = await fetchAllGroup();
        setGroups(data);
      };
    loadGroups();
    //Hàm debounced fetch user
    debouncedFetchUsers(keyword);
  
    return () => {
      debouncedFetchUsers.cancel(); // cleanup debounce
    };
  }, [keyword]);

  //Hàm edit user
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      if (!editinguser?._id) {
        toast.error('Không tìm thấy ID vai trò để cập nhật!');
        return;
      }
  
      const userData = {
        id: String(editinguser._id),
        name: newuser.name,
        role: newuser.role,
      };
  
      const result = await toast.promise(
        updateUser(userData),
        {
          success: 'Cập nhật thành công!',
          error: 'Cập nhật thất bại!',
        }
      );
  
      if (!result) return;
  
      // Cập nhật lại list vai trò
      setUsers(prev => prev.map(r => r._id === result._id ? result : r));
  
      // Reset form
      setNewUser({ name: '', email: '', password: '', newPassword: '', role: '' });
      setEditinguser(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật vai trò:', error);
    }
  };
 
  //Hàm click update
  const handleEditClick = (user: User) => {
    setEditinguser(user); 
    setNewUser({ name: user.name, email: user.email, password: user.password, newPassword: '', role: user.role }); 
    setIsModalOpen(true);
  };

  //Hàm click khi xóa
  const handleDeleteClick = (id: string | number) => {
    setSelecteduserId(id);
    setIsDeleteModalOpen(true);
  };
  
  //Hàm xóa
  const handleConfirmDelete = async () => {
    if (!selecteduserId) return;
  
    const result = await toast.promise(deleteUser(selecteduserId), {
      success: 'Xóa thành công!',
      error: 'Xóa thất bại!',
    });
  
    if (result) {
      setUsers(prev => prev.filter(user => user._id !== selecteduserId));
    }
  
    setIsDeleteModalOpen(false);
    setSelecteduserId('');
  };

  //Hàm input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  //Hàm chọn nhóm quyền
  const handleSelectGroup = (selectedRole: string) => {
    setNewUser((prev) => ({ ...prev, role: selectedRole }));
    };

  //Hàm đổi mật khẩu
  const handleChangePasswordClick = (user: User) => {
    setEditingPassword(user); 
    setNewUser({ name: user.name, email: user.email, password: user.password, newPassword: '', role: user.role }); 
    setIsModalPassOpen(true);
  };

  //Hàm change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      if (!editingPassword?._id) {
        toast.error('Không tìm thấy ID người dùng để đổi mật khẩu!');
        return;
      }
  
      const userData = {
        id: String(editingPassword._id),
        oldPassword: newuser.password,
        newPassword: newuser.newPassword,
      };
  
      const result = await toast.promise(
        changePassword(userData),
        {
          success: 'Cập nhật vai trò thành công!',
          error: 'Cập nhật vai trò thất bại!',
        }
      );
  
      if (!result) return;
  
      // Cập nhật lại list vai trò
      setUsers(prev => prev.map(r => r._id === result._id ? result : r));
  
      // Reset form
      setNewUser({ name: '', email: '', password: '', newPassword: '', role: '' });
      setEditingPassword(null);
      setIsModalPassOpen(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật mật khẩu:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Danh sách quyền</h1>
        </div>
        <div className="flex items-center justify-between mb-4 mt-4 ml-2">
            <div className="flex items-center space-x-4">
                <Input
                    placeholder="Tìm kiếm người dùng..."
                    className="w-64 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    onChange={(e) => debouncedFetchUsers(e.target.value)}
                />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên tài khoản</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhóm quyền</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingUsers ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Không có user nào
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        onClick={() => handleEditClick(user)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        onClick={() => handleDeleteClick(user._id)}>
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
                        <button
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                            onClick={() => handleChangePasswordClick(user)}
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                fillRule="evenodd"
                                d="M10 2a8 8 0 11-8 8 8 8 0 018-8zM4 10a6 6 0 1012 0A6 6 0 004 10zm8-1.5a1.5 1.5 0 00-3 0v3a1.5 1.5 0 003 0V8.5z"
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
            Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{users.length}</span> trong{' '}
            <span className="font-medium">{users.length}</span> users
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
      <AddUserModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        newUser={newuser}
        handleInputChange={handleInputChange}
        handleUpdateUser={handleUpdateUser} 
        triggerButtonRef={triggerButtonRef} 
        handleSelectGroup={handleSelectGroup}
        groups={groups}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      /> 
      <ChangePasswordModal
        isOpen={isModalPassOpen}
        setIsOpen={setIsModalPassOpen}
        newUser={newuser}
        handleInputChange={handleInputChange}
        handleChangePassword ={handleChangePassword} 
        triggerButtonRef={triggerButtonRef} 
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