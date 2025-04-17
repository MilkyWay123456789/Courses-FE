// service/Group.service.ts 
import axiosInstance from './axiosInstance'; 

export interface Group {
  _id: string | number; 
  name: string;   
  description: string;     
}
// Hàm gọi API lấy tất cả Group
export const fetchAllGroup = async (): Promise<Group[]> => {
  try {
    const response = await axiosInstance.get<Group[]>('groups/GetGroup');
    return response.data;
  } catch (error) {
    console.error("Error fetching Groups:", error);
    return [];
  }
};

// Hàm gọi API thêm Group mới
export const addGroup = async (Group: Omit<Group, '_id'>): Promise<Group | null> => {
    try {
      const response = await axiosInstance.post<Group>('groups/AddGroup', Group);
      return response.data;
    } catch (error) {
      console.error("Error adding Group:", error);
      return null;
    }
  };

//Hàm update group
  export const updateGroup = async (
    id: string | number,
    Group: Omit<Group, '_id'>
  ): Promise<Group | null> => {
    try {
      const response = await axiosInstance.put<Group>(`groups/UpdateGroup/${id}`, Group);
      return response.data;
    } catch (error) {
      console.error("Error updating Group:", error);
      return null;
    }
  };

//Hàm delete Group
export const deleteGroup = async (
  id: string | number,
): Promise<Boolean> => {
  try {
    const response = await axiosInstance.delete<Group>(`groups/DeleteGroup/${id}`);
    return true;
  } catch (error) {
    console.error("Error updating Group:", error);
    return false;
  }
};
  