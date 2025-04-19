'use client';
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchAllRoles, Role } from '@/service/role.service'; 
import { fetchAllGroup, Group } from '@/service/group.service';
import { fetchPermissionsByGroup, updatePermission, Permission } from '@/service/permission.service'; 
import { toast } from 'react-toastify'


export default function UserRoleManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState<Role[]>([]); 
  const [groups, setGroups] = useState<Group[]>([]); 
  const [isLoadingRoles, setIsLoadingRoles] = useState(false); 
  const [isLoadingGroups, setIsLoadingGroups] = useState(false); 
  const [selectedGroupId, setSelectedGroupId] = useState<string | number>();

  //Hàm search 
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      fetchAllGroup(value).then(setGroups);
    }, 500),
    []
  );
  // Gọi API khi component được mount lần đầu
  useEffect(() => {
    //Hàm load role 
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
    //Gọi hàm search group
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);


  //Hàm get permission
  const handleClick = async (groupId: string | number) => {
    setSelectedGroupId(groupId);

    // Gọi API lấy danh sách permission theo groupId
    const permissionData = await fetchPermissionsByGroup(groupId); 
  
    // Tạo 1 map để tra nhanh theo roleId
    const permissionMap = new Map<string, boolean>();
    permissionData.forEach(p => {
      permissionMap.set(p.roleId, p.enable); 
    });
  
    // Cập nhật lại trạng thái enable của từng role dựa vào permissionMap
    setRoles(prev =>
      prev.map(role => ({
        ...role,
        enable: permissionMap.get(String(role._id)) ?? false,
      }))
    );
  };
  
  //Hàm lưu permission
  const handleSavePermissions = async () => {
    if (!selectedGroupId) {
      toast.error("Vui lòng chọn nhóm trước khi lưu quyền!");
      return;
    }
  
    const checkedPermissions = roles
    .filter(role => role.enable)
    .map(role => ({
      roleId: String(role._id),
      groupId: String(selectedGroupId),
      enable: true,
    }));
  
    const success = await updatePermission(selectedGroupId, checkedPermissions);
  
    if (success) {
      toast.success("Cập nhật quyền thành công!");
    } else {
      toast.error("Có lỗi khi cập nhật quyền.");
    }
  };

  //Xử lý checkbox
  const toggleRoleEnable = (roleId: string | number) => {
    setRoles(prev =>
      prev.map(role =>
        role._id === roleId
          ? { ...role, enable: role.enable === undefined ? false : !role.enable }
          : role
      )
    );
  };
  
  
  
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
                        placeholder="Tìm kiếm nhóm quyền..."
                        className="w-64 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded-md"
                    onClick={handleSavePermissions}>
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
                                {groups.map((group, index) => (
                                  <tr
                                    key={group._id}
                                    onClick={() => handleClick(group._id)}
                                    className={`cursor-pointer hover:bg-gray-50 ${
                                      selectedGroupId === group._id ? 'bg-blue-100' : ''
                                    }`}
                                  >                              
                                    <td className="p-3 text-sm text-gray-600 border-r border-gray-300 w-[60px]">{index + 1}</td>
                                    <td className="p-3 text-sm font-medium text-gray-800 border-r border-gray-300 w-[40%]">
                                    {group.name}
                                    </td>
                                    <td className="p-3 text-sm font-medium text-gray-800">{group.description}</td>
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
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {roles.map((role, index) => (
                                <tr key={role._id} className="hover:bg-gray-50">
                                    <td className="p-3 text-sm text-gray-600 w-[60px]">{index + 1}</td>
                                    <td className="p-3 text-sm text-gray-600">{role.name}</td>
                                    <td className="p-3 text-sm text-gray-600">{role.description}</td>
                                    <td className="p-3 text-sm w-[80px]">
                                    <div className="flex items-center justify-center">
                                        <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 accent-blue-600"
                                        checked={role.enable || false}
                                        onChange={() => toggleRoleEnable(role._id)}
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