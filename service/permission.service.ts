// service/Permission.service.ts 
import axiosInstance from './axiosInstance'; 

export interface Role {
    _id: string;
    name: string;
    description: string;
  }
  
  export interface Permission {
    _id: string | number;
    roleId: string;
    groupId: string;
    enable: boolean;
  }
  
// Hàm gọi API lấy tất cả Permission theo role id
export const fetchPermissionsByRole = async (roleId: string | number): Promise<Role[]> => {
    try {
      // Gọi API để lấy danh sách các role theo roleId
      const response = await axiosInstance.get<{ roles: Role[] }>(`permissions/GetPermissionByGroupId/${roleId}`);
      
      // Trả về danh sách các role
      return response.data.roles;
    } catch (error) {
      console.error("Error fetching Permissions:", error);
      return [];
    }
  };

//Hàm update Permission
  export const updatePermission = async (
    roleid: string | number,
    Permission: Omit<Permission, '_id'>
  ): Promise<Permission | null> => {
    try {
      const response = await axiosInstance.put<Permission>(`permissions/UpdatePermission/${roleid}`, Permission);
      return response.data;
    } catch (error) {
      console.error("Error updating Permission:", error);
      return null;
    }
  };

  