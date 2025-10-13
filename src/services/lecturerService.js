import axios from 'axios';

const lecturerService = {
  // Get lecturer's courses
  getMyCourses: async () => {
    try {
      const response = await axios.get('/Lecturer/my-course');
      console.log('Courses API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get tasks for a specific module
  getModuleTasks: async (moduleId) => {
    try {
      console.log('Fetching tasks for module:', moduleId);
      const response = await axios.get(`/Lecturer/modules/${moduleId}/tasks`);
      console.log('Tasks API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching module tasks:', error.response?.data || error.message);
      throw error;
    }
  },

  // Create a new task
  createTask: async (moduleId, taskData) => {
    try {
      console.log('Creating task for module:', moduleId, 'with data:', taskData);
      const response = await axios.post(`/Lecturer/modules/${moduleId}/tasks`, taskData);
      console.log('Create task API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update an existing task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await axios.put(`/Lecturer/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    try {
      const response = await axios.delete(`/Lecturer/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default lecturerService;