import axiosInstance from './axiosInstance'; 

export interface User {
  _id: string | number; 
  email: string;  
  name: string; 
  password: string;  
  role: string;   
}
// Hàm gọi API lấy tất cả User
export const fetchAllUser = async (
    page: number = 1,
    limit: number = 10,
    keyword?: string
  ): Promise<{ data: User[]; total: number }> => {
    try {
      const response = await axiosInstance.get<{ data: User[]; total: number }>(
        'users/GetAllUsers',
        {
          params: {
            page,
            limit,
            keyword,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return { data: [], total: 0 };
    }
  }

// Hàm gọi API cập nhật user
export const updateUser = async (userData: {
  id: string;
  name?: string;
  role?: string;
}): Promise<User> => {
  try {
    const response = await axiosInstance.put<User>('/users/UpdateUser', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
//Hàm delete user
export const deleteUser = async (
  id: string | number,
): Promise<Boolean> => {
  try {
    const response = await axiosInstance.delete<User>(`users/DeleteUser/${id}`);
    return true;
  } catch (error) {
    console.error("Error updating Group:", error);
    return false;
  }
};
