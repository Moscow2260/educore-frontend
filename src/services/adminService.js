import axios from 'axios';
import { showSuccess, showError, showLoading, updateToast } from '../utils/toast';

const API_BASE_URL = 'https://localhost:7065/api/Admin';

// Enhanced admin service with toast notifications
const adminService = {
  // ========== LECTURERS ==========
  getLecturers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lecturers`);
      return response.data;
    } catch (error) {
      showError('Failed to load lecturers');
      throw error;
    }
  },

  createLecturer: async (data) => {
    const toastId = showLoading('Creating lecturer...');
    try {
      const response = await axios.post(`${API_BASE_URL}/lecturers`, data);
      updateToast(toastId, 'success', 'Lecturer created successfully!');
      return response.data;
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to create lecturer');
      throw error;
    }
  },

  updateLecturer: async (id, data) => {
    const toastId = showLoading('Updating lecturer...');
    try {
      const response = await axios.put(`${API_BASE_URL}/lecturers/${id}`, data);
      updateToast(toastId, 'success', 'Lecturer updated successfully!');
      return response.data;
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to update lecturer');
      throw error;
    }
  },

  deleteLecturer: async (id) => {
    const toastId = showLoading('Deleting lecturer...');
    try {
      await axios.delete(`${API_BASE_URL}/lecturers/${id}`);
      updateToast(toastId, 'success', 'Lecturer deleted successfully!');
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to delete lecturer');
      throw error;
    }
  },

  // ========== STUDENTS ==========
  getStudents: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students`);
      return response.data;
    } catch (error) {
      showError('Failed to load students');
      throw error;
    }
  },

  createStudent: async (data) => {
    const toastId = showLoading('Creating student...');
    try {
      const response = await axios.post(`${API_BASE_URL}/students`, data);
      updateToast(toastId, 'success', 'Student created successfully!');
      return response.data;
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to create student');
      throw error;
    }
  },

  updateStudent: async (id, data) => {
    const toastId = showLoading('Updating student...');
    try {
      const response = await axios.put(`${API_BASE_URL}/students/${id}`, data);
      updateToast(toastId, 'success', 'Student updated successfully!');
      return response.data;
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to update student');
      throw error;
    }
  },

  deleteStudent: async (id) => {
    const toastId = showLoading('Deleting student...');
    try {
      await axios.delete(`${API_BASE_URL}/students/${id}`);
      updateToast(toastId, 'success', 'Student deleted successfully!');
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to delete student');
      throw error;
    }
  },

  // ========== COURSES ==========
  getCourses: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses`);
      return response.data;
    } catch (error) {
      showError('Failed to load courses');
      throw error;
    }
  },

  createCourse: async (data) => {
    const toastId = showLoading('Creating course...');
    try {
      const response = await axios.post(`${API_BASE_URL}/courses`, data);
      updateToast(toastId, 'success', 'Course created successfully!');
      return response.data;
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to create course');
      throw error;
    }
  },

  updateCourse: async (id, data) => {
    const toastId = showLoading('Updating course...');
    try {
      const response = await axios.put(`${API_BASE_URL}/courses/${id}`, data);
      updateToast(toastId, 'success', 'Course updated successfully!');
      return response.data;
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to update course');
      throw error;
    }
  },

  deleteCourse: async (id) => {
    const toastId = showLoading('Deleting course...');
    try {
      await axios.delete(`${API_BASE_URL}/courses/${id}`);
      updateToast(toastId, 'success', 'Course deleted successfully!');
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to delete course');
      throw error;
    }
  },

  // ========== MODULES ==========
  getCourseModules: async (courseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/modules`);
      return response.data;
    } catch (error) {
      showError('Failed to load course modules');
      throw error;
    }
  },

  createModule: async (courseId, data) => {
    const toastId = showLoading('Creating module...');
    try {
      const response = await axios.post(`${API_BASE_URL}/courses/${courseId}/modules`, data);
      updateToast(toastId, 'success', 'Module created successfully!');
      return response.data;
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to create module');
      throw error;
    }
  },

  updateModule: async (moduleId, data) => {
    const toastId = showLoading('Updating module...');
    try {
      const response = await axios.put(`${API_BASE_URL}/modules/${moduleId}`, data);
      updateToast(toastId, 'success', 'Module updated successfully!');
      return response.data;
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to update module');
      throw error;
    }
  },

  deleteModule: async (moduleId) => {
    const toastId = showLoading('Deleting module...');
    try {
      await axios.delete(`${API_BASE_URL}/modules/${moduleId}`);
      updateToast(toastId, 'success', 'Module deleted successfully!');
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to delete module');
      throw error;
    }
  },

  // ========== ASSIGNMENTS ==========
  assignLecturerToCourse: async (courseId, lecturerId) => {
    const toastId = showLoading('Assigning lecturer...');
    try {
      await axios.post(`${API_BASE_URL}/courses/${courseId}/assign-lecturer/${lecturerId}`);
      updateToast(toastId, 'success', 'Lecturer assigned successfully!');
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to assign lecturer');
      throw error;
    }
  },

  removeLecturerFromCourse: async (courseId) => {
    const toastId = showLoading('Removing lecturer...');
    try {
      await axios.delete(`${API_BASE_URL}/courses/${courseId}/remove-lecturer`);
      updateToast(toastId, 'success', 'Lecturer removed successfully!');
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to remove lecturer');
      throw error;
    }
  },

  assignStudentToCourse: async (courseId, studentId) => {
    const toastId = showLoading('Assigning student...');
    try {
      await axios.post(`${API_BASE_URL}/courses/${courseId}/assign-student/${studentId}`);
      updateToast(toastId, 'success', 'Student assigned successfully!');
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to assign student');
      throw error;
    }
  },

  removeStudentFromCourse: async (courseId, studentId) => {
    const toastId = showLoading('Removing student...');
    try {
      await axios.delete(`${API_BASE_URL}/courses/${courseId}/remove-student/${studentId}`);
      updateToast(toastId, 'success', 'Student removed successfully!');
    } catch (error) {
      updateToast(toastId, 'error', 'Failed to remove student');
      throw error;
    }
  },

  // ========== GET ASSIGNMENTS ==========
  getEnrolledStudents: async (courseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/enrolled-students`);
      return response.data;
    } catch (error) {
      showError('Failed to load enrolled students');
      throw error;
    }
  },

  getAssignedLecturer: async (courseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/assigned-lecturer`);
      return response.data;
    } catch (error) {
      // Return null if no lecturer assigned (404)
      if (error.response?.status === 404) {
        return null;
      }
      showError('Failed to load assigned lecturer');
      throw error;
    }
  },

  // ========== USER MANAGEMENT ==========
  getUsersByType: async (userType) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userType}`);
      return response.data;
    } catch (error) {
      showError(`Failed to load ${userType}`);
      throw error;
    }
  },

  searchUsers: async (userType, searchTerm) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${userType}/search?term=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      showError(`Failed to search ${userType}`);
      throw error;
    }
  }
};

export default adminService;