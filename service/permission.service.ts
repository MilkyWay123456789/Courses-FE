// service/Permission.service.ts 
import axiosInstance from './axiosInstance'; 

export interface Role {
    _id: string;
    name: string;
    description: string;
    enable?: boolean;
  }
  
  export interface Permission {
    _id: string | number;
    roleId: string;
    groupId: string;
    enable: boolean;
  }
  
// Hàm gọi API lấy tất cả Permission theo role id
export const fetchPermissionsByGroup = async (groupId: string | number): Promise<Permission[]> => {
  try {
    // Gọi API để lấy danh sách các permission theo groupId
    const response = await axiosInstance.get<Permission[]>(`permissions/GetPermissionByGroupId/${groupId}`);

    // Trả về danh sách permission
    return response.data;
  } catch (error) {
    console.error("Error fetching Permissions:", error);
    return [];
  }
};

//Hàm update Permission
  export const updatePermission = async (
    roleid: string | number,
    Permission: Array<Omit<Permission, '_id'>>
  ): Promise<Permission | null> => {
    try {
      const response = await axiosInstance.put<Permission>(`permissions/UpdatePermissions/${roleid}`, Permission);
      return response.data;
    } catch (error) {
      console.error("Error updating Permission:", error);
      return null;
    }
  };

  