import axios from 'axios';
import { showSuccess, showError, showLoading, updateToast } from '../utils/toast';

const API_BASE_URL = 'https://localhost:7065/api/Student';

const studentService = {
  // ========== TASKS ==========
  getTasks: async (status = '') => {
    try {
      const params = status ? { status } : {};
      const response = await axios.get(`${API_BASE_URL}/tasks`, { params });
      return response.data;
    } catch (error) {
      showError('Failed to load tasks');
      throw error;
    }
  },

  getStatusOptions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/status-options`);
      return response.data;
    } catch (error) {
      showError('Failed to load status options');
      throw error;
    }
  },

  updateTaskStatus: async (taskId, status) => {
    const toastId = showLoading('Updating task status...');
    try {
      await axios.put(`${API_BASE_URL}/tasks/${taskId}/status`, { status });
      updateToast(toastId, 'success', 'Task status updated successfully!');
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to update task status');
      throw error;
    }
  },

  // ========== COURSES ==========
  
};

export default studentService;