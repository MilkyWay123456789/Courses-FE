'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { fetchAllUser, User } from '@/service/user.service'; 
import AddUserModal from './Modal/AddUserModal';
import DeleteModal from './Modal/DeleteModal';
import { toast } from 'react-toastify'

export default function Users() {
  const [keyword, setKeyword] = useState(''); 
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newuser, setNewuser] = useState({ name: '', email: '', password: '' , role: '' });
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [editinguser, setEditinguser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selecteduserId, setSelecteduserId] = useState<string | number>();

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
    debouncedFetchUsers(keyword);
  
    return () => {
      debouncedFetchUsers.cancel(); // cleanup debounce
    };
  }, [keyword]);

  //Hàm edit user
//   const handleUpdateUser = async (e: React.FormEvent) => {
//     e.preventDefault();
  
//     try {
//       if (!editinguser?._id) {
//         toast.error('Không tìm thấy ID vai trò để cập nhật!');
//         return;
//       }
  
//       const userData = {
//         name: newuser.name,
//         description: newuser.description,
//       };
  
//       const result = await toast.promise(
//         updateUser(editinguser._id, userData),
//         {
//           success: 'Cập nhật vai trò thành công!',
//           error: 'Cập nhật vai trò thất bại!',
//         }
//       );
  
//       if (!result) return;
  
//       // Cập nhật lại list vai trò
//       setUsers(prev => prev.map(r => r._id === result._id ? result : r));
  
//       // Reset form
//       setNewUser({ name: '', description: '' });
//       setEditinguser(null);
//       setIsModalOpen(false);
//       setMode('add');
//     } catch (error) {
//       console.error('Lỗi khi cập nhật vai trò:', error);
//     }
//   };
 
  //Hàm click update
  const handleEditClick = (user: User) => {
    setEditinguser(user); 
    setNewuser({ name: user.name, email: user.email, password: user.password, role: user.role }); 
    setIsModalOpen(true); 
    setMode('edit'); 
  };

  //Hàm click khi xóa
  const handleDeleteClick = (id: string | number) => {
    setSelecteduserId(id);
    setIsDeleteModalOpen(true);
  };
  
  //Hàm xóa
//   const handleConfirmDelete = async () => {
//     if (!selecteduserId) return;
  
//     const result = await toast.promise(deleteUser(selecteduserId), {
//       success: 'Xóa thành công!',
//       error: 'Xóa thất bại!',
//     });
  
//     if (result) {
//       setUsers(prev => prev.filter(user => user._id !== selecteduserId));
//     }
  
//     setIsDeleteModalOpen(false);
//     setSelecteduserId('');
//   };
//Hàm input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewuser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Danh sách quyền</h1>
        </div>
        <div className="px-2 py-4 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-xs"
            onChange={(e) => debouncedFetchUsers(e.target.value)}
          />
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
      {/* <AddUserModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        newUser={newuser}
        handleInputChange={handleInputChange}
        handleUpdateUser={handleUpdateUser} 
        triggerButtonRef={triggerButtonRef} 
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      /> */}
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