import { schoolAPI } from '../utils/api';
import type { Class, CreateClassData, ClassStats, ClassApiResponse, ApiResponse } from '../types/class';

export const classService = {
  // Get all classes with pagination
  getClasses: async (page: number = 1, pageSize: number = 20): Promise<ClassApiResponse> => {
    try {
      const response = await schoolAPI.get(`/classes/?page=${page}&page_size=${pageSize}`);
      console.log('Classes API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  },

  // Get class statistics
  getClassStats: async (): Promise<ClassStats> => {
    try {
      const response = await schoolAPI.get('/classes/stats/');
      console.log('Class Stats API Response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching class stats:', error);
      throw error;
    }
  },

  // Create a new class
  createClass: async (classData: CreateClassData): Promise<Class> => {
    try {
      const response = await schoolAPI.post('/classes/', classData);
      console.log('Create Class API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  },

  // Update a class
  updateClass: async (id: number, classData: Partial<CreateClassData>): Promise<Class> => {
    try {
      const response = await schoolAPI.patch(`/classes/${id}/`, classData);
      return response.data;
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  },

  // Delete a class
  deleteClass: async (id: number): Promise<void> => {
    try {
      await schoolAPI.delete(`/classes/${id}/`);
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  },

  // Upload CSV file
  uploadCSV: async (file: File): Promise<ApiResponse<{ created_count: number; classes: Class[] }>> => {
    try {
      const formData = new FormData();
      formData.append('csv_file', file);
      
      const response = await schoolAPI.post('/classes/upload-csv/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Upload CSV API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading CSV:', error);
      throw error;
    }
  },
};
