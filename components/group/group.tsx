'use client';
import { useState, useEffect, useRef } from 'react';
import { fetchAllGroup, addGroup, updateGroup, deleteGroup, Group } from '@/service/group.service'; 
import AddGroupModal from './Modal/AddGroupModal';
import DeleteModal from './Modal/DeleteGroupModal';
import { toast } from 'react-hot-toast';

export default function Groups() {
  const [searchTerm, setSearchTerm] = useState('');
  const [Group, setGroup] = useState<Group[]>([]);
  const [isLoadingGroup, setIsLoadingGroup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | number>();

  // Gọi API khi component được mount lần đầu
  useEffect(() => {
    const loadGroup = async () => {
      setIsLoadingGroup(true);
      try {
        const fetchedGroup = await fetchAllGroup();
        setGroup(fetchedGroup);
      } catch (error) {
        console.error("Failed to load Group:", error);
      } finally {
        setIsLoadingGroup(false);
      }
    };

    loadGroup();
  }, []);

  //Hàm add Group
  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const result = await toast.promise(
        addGroup(newGroup),
        {
          loading: 'Đang thêm vai trò...',
          success: 'Thêm vai trò thành công!',
          error: 'Thêm vai trò thất bại!',
        }
      );
  
      // Nếu result là null (do API trả về), bỏ qua
      if (!result) return;
  
      setGroup(prev => [...prev, result]);
      setNewGroup({ name: '', description: '' });
      setIsModalOpen(false);
      setMode('add');
    } catch (error) {
      // Có thể log lỗi nếu cần
      console.error('Lỗi khi thêm vai trò:', error);
    }
  };

  //Hàm edit Group
  const handleUpdateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      if (!editingGroup?._id) {
        toast.error('Không tìm thấy ID vai trò để cập nhật!');
        return;
      }
  
      const GroupData = {
        name: newGroup.name,
        description: newGroup.description,
      };
  
      const result = await toast.promise(
        updateGroup(editingGroup._id, GroupData),
        {
          loading: 'Đang cập nhật vai trò...',
          success: 'Cập nhật vai trò thành công!',
          error: 'Cập nhật vai trò thất bại!',
        }
      );
  
      if (!result) return;
  
      // Cập nhật lại list vai trò
      setGroup(prev => prev.map(r => r._id === result._id ? result : r));
  
      // Reset form
      setNewGroup({ name: '', description: '' });
      setEditingGroup(null);
      setIsModalOpen(false);
      setMode('add');
    } catch (error) {
      console.error('Lỗi khi cập nhật vai trò:', error);
    }
  };
 
  //Hàm click update
  const handleEditClick = (Group: Group) => {
    setEditingGroup(Group); 
    setNewGroup({ name: Group.name, description: Group.description }); 
    setIsModalOpen(true); 
    setMode('edit'); 
  };

  //Hàm click khi xóa
  const handleDeleteClick = (id: string | number) => {
    setSelectedGroupId(id);
    setIsDeleteModalOpen(true);
  };
  
  //Hàm xóa
  const handleConfirmDelete = async () => {
    if (!selectedGroupId) return;
  
    const result = await toast.promise(deleteGroup(selectedGroupId), {
      loading: 'Đang xóa vai trò...',
      success: 'Xóa thành công!',
      error: 'Xóa thất bại!',
    });
  
    if (result) {
      setGroup(prev => prev.filter(Group => Group._id !== selectedGroupId));
    }
  
    setIsDeleteModalOpen(false);
    setSelectedGroupId('');
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewGroup((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Danh sách nhóm</h1>
          <button
            ref={triggerButtonRef} // Thêm ref vào button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Thêm nhóm mới
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên nhóm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingGroup ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : Group.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Không có Group nào
                  </td>
                </tr>
              ) : (
                Group.map((Group, index) => (
                  <tr key={Group._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Group.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{Group.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        onClick={() => handleEditClick(Group)}>
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
                        onClick={() => handleDeleteClick(Group._id)}>
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
            Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{Group.length}</span> trong{' '}
            <span className="font-medium">{Group.length}</span> Group
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
      <AddGroupModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        newGroup={newGroup}
        handleInputChange={handleInputChange}
        handleAddGroup={handleAddGroup}
        handleUpdateGroup={handleUpdateGroup} 
        mode={mode} 
        triggerButtonRef={triggerButtonRef} 
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
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