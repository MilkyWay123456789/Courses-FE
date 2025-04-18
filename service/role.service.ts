// service/role.service.ts 
import axiosInstance from './axiosInstance'; 
// Định nghĩa kiểu dữ liệu cho Role (điều chỉnh nếu cần)
export interface Role {
  _id: string | number; // Hoặc kiểu ID thực tế của bạn
  name: string;   
  description: string; 
  enable?: boolean;    
}
// Hàm gọi API lấy tất cả roles
export const fetchAllRoles = async (): Promise<Role[]> => {
  try {
    const response = await axiosInstance.get<Role[]>('roles/GetRole');
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
};

// Hàm gọi API thêm role mới
export const addRole = async (role: Omit<Role, '_id'>): Promise<Role | null> => {
    try {
      const response = await axiosInstance.post<Role>('roles/AddRole', role);
      return response.data;
    } catch (error) {
      console.error("Error adding role:", error);
      return null;
    }
  };
//Hàm update role
  export const updateRole = async (
    id: string | number,
    role: Omit<Role, '_id'>
  ): Promise<Role | null> => {
    try {
      const response = await axiosInstance.put<Role>(`roles/UpdateRole/${id}`, role);
      return response.data;
    } catch (error) {
      console.error("Error updating role:", error);
      return null;
    }
  };

//Hàm delete role
export const deleteRole = async (
  id: string | number,
): Promise<Boolean> => {
  try {
    const response = await axiosInstance.delete<Role>(`roles/DeleteRole/${id}`);
    return true;
  } catch (error) {
    console.error("Error updating role:", error);
    return false;
  }
};
  