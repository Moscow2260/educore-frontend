import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Nav } from 'react-bootstrap';
import { useAuth } from '../../Auth/AuthContext';
import lecturerService from '../../../services/lecturerService';
import { showError, showSuccess } from '../../../utils/toast';
import '../../../styles/LecturerPortal.css';

const LecturerPortal = () => {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [taskForm, setTaskForm] = useState({
    name: '',
    dueDate: '',
    description: ''
  });

  useEffect(() => {
    loadCourses();
  }, []);

  // Load courses and modules
  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await lecturerService.getMyCourses();
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      showError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // Load tasks for selected module
  const loadTasks = async (moduleId) => {
    try {
      const data = await lecturerService.getModuleTasks(moduleId);
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      showError('Failed to load tasks');
      setTasks([]);
    }
  };

  // Handle module selection change
  const handleModuleChange = (moduleId) => {
    setSelectedModule(moduleId);
    if (moduleId) {
      loadTasks(moduleId);
    } else {
      setTasks([]);
    }
  };

  // Open modal for creating new task
  const openTaskModal = () => {
    setEditingTaskIndex(null);
    setTaskForm({
      name: '',
      dueDate: '',
      description: ''
    });
    setShowTaskModal(true);
  };

  // Open modal for editing existing task
  const editTask = (index) => {
    const task = tasks[index];
    setEditingTaskIndex(index);
    setTaskForm({
      name: task.name,
      dueDate: task.dueDate.split('T')[0], // Format date for input
      description: task.description || ''
    });
    setShowTaskModal(true);
  };

  // Handle task form submission (create or update)
  const handleTaskSubmit = async (e) => {
  e.preventDefault();
  
  if (!taskForm.name || !taskForm.dueDate || !selectedModule) {
    showError('Please fill in all fields and select a module');
    return;
  }

  setLoading(true); // show spinner while saving

  try {
    if (editingTaskIndex === null) {
      await lecturerService.createTask(selectedModule, taskForm);
      showSuccess('✅ Task created successfully!');
    } else {
      const taskId = tasks[editingTaskIndex].taskId;
      await lecturerService.updateTask(taskId, taskForm);
      showSuccess('✏️ Task updated successfully!');
    }

    // Reset form and close modal AFTER tasks refresh
    await loadTasks(selectedModule); // 🔄 reload immediately
    setShowTaskModal(false);
    setTaskForm({ name: '', dueDate: '', description: '' });
    setEditingTaskIndex(null);
  } catch (error) {
    console.error('Error saving task:', error);
    showError('Failed to save task');
  } finally {
    setLoading(false);
  }
};


  // Delete task
  const deleteTask = async (index) => {
    const taskId = tasks[index].taskId;
    const taskName = tasks[index].name;
    
    if (window.confirm(`Are you sure you want to delete task "${taskName}"?`)) {
      try {
        await lecturerService.deleteTask(taskId);
        showSuccess('Task deleted successfully!');
        loadTasks(selectedModule); // Refresh tasks
      } catch (error) {
        console.error('Error deleting task:', error);
        showError('Failed to delete task');
      }
    }
  };

  // Get module name by ID
  const getModuleName = (moduleId) => {
    for (const course of courses) {
      const module = course.modules?.find(m => m.moduleId === moduleId);
      if (module) return `${course.name} - ${module.name}`;
    }
    return 'Unknown Module';
  };

  return (
    <div className="lecturer-portal">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark p-3">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">
            <i className="bi bi-mortarboard me-2"></i>
            Educore Lecturer Portal
          </span>
          <div className="d-flex align-items-center">
            <span className="text-white me-3">Welcome, {user?.name || 'Lecturer'}</span>
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col md={3} className="bg-light sidebar p-3">
            <h6 className="fw-bold text-uppercase mb-3">Dashboard</h6>
            <Nav className="flex-column">
              <Nav.Link href="#courses" className="active">
                <i className="bi bi-book me-2"></i>
                My Courses & Modules
              </Nav.Link>
              <Nav.Link href="#tasks">
                <i className="bi bi-list-task me-2"></i>
                Manage Tasks
              </Nav.Link>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col md={9} className="p-4">
            <h3 className="mb-4">Lecturer Dashboard</h3>

            {/* Courses Section */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-book me-2"></i>
                  My Courses & Modules
                </h5>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading courses...</p>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center text-muted py-3">
                    <i className="bi bi-info-circle me-2"></i>
                    No courses found.
                  </div>
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Course Name</th>
                        <th>Modules</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map(course => (
                        <tr key={course.courseId}>
                          <td>{course.name}</td>
                          <td>
                            {course.modules?.map(module => module.name).join(', ') || 'No modules'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>

            {/* Tasks Section */}
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-list-task me-2"></i>
                  Manage Tasks
                </h5>
                <div className="d-flex align-items-center">
                  <Form.Select
                    value={selectedModule}
                    onChange={(e) => handleModuleChange(e.target.value)}
                    style={{ width: 'auto' }}
                    className="me-2"
                  >
                    <option value="">Select Module...</option>
                    {courses.map(course => 
                      course.modules?.map(module => (
                        <option key={module.moduleId} value={module.moduleId}>
                          {course.name} - {module.name}
                        </option>
                      ))
                    )}
                  </Form.Select>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!selectedModule}
                    onClick={openTaskModal}
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Add Task
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {tasks.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-info-circle me-2"></i>
                    {selectedModule ? 'No tasks created.' : 'Select a module to view tasks.'}
                  </div>
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Task ID</th>
                        <th>Task Name</th>
                        <th>Due Date</th>
                        <th>Module</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task, index) => (
                        <tr key={task.taskId}>
                          <td>{task.taskId || `T${index + 1}`}</td>
                          <td>{task.name}</td>
                          <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                          <td>{task.moduleName || getModuleName(selectedModule)}</td>
                          <td>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              className="me-1"
                              onClick={() => editTask(index)}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => deleteTask(index)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>

            {/* Add/Edit Task Modal */}
            <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {editingTaskIndex === null ? 'Add New Task' : 'Edit Task'}
                </Modal.Title>
              </Modal.Header>
              <Form onSubmit={handleTaskSubmit}>
                <Modal.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Module *</Form.Label>
                    <Form.Select
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(e.target.value)}
                      required
                    >
                      <option value="">Select Module...</option>
                      {courses.map(course => 
                        course.modules?.map(module => (
                          <option key={module.moduleId} value={module.moduleId}>
                            {course.name} - {module.name}
                          </option>
                        ))
                      )}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Task Name *</Form.Label>
                    <Form.Control
                      type="text"
                      value={taskForm.name}
                      onChange={(e) => setTaskForm({...taskForm, name: e.target.value})}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Due Date *</Form.Label>
                    <Form.Control
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                      placeholder="Optional task description..."
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowTaskModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    {editingTaskIndex === null ? 'Create Task' : 'Update Task'}
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LecturerPortal;