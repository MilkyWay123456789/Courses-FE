// service/role.service.ts 
import axiosInstance from './axiosInstance'; 
// Định nghĩa kiểu dữ liệu cho Role (điều chỉnh nếu cần)
export interface Role {
  _id: string | number; // Hoặc kiểu ID thực tế của bạn
  name: string;        
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