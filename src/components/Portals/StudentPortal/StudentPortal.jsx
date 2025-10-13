import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Nav } from 'react-bootstrap';
import { useAuth } from '../../Auth/AuthContext';
import studentService from '../../../services/studentService';
import { showError, showSuccess } from '../../../utils/toast';
import '../../../styles/StudentPortal.css';

const StudentPortal = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatusOptions();
    fetchTasks();
  }, []);

  // Fetch status options from backend
  const fetchStatusOptions = async () => {
    try {
      const data = await studentService.getStatusOptions();
      setStatusOptions(data || []);
    } catch (err) {
      console.error('Failed to load status options:', err);
      showError('Failed to load status options');
    }
  };

  // Fetch tasks from backend (without filtering)
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await studentService.getTasks(''); // Get all tasks
      setTasks(data || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      showError('Could not load tasks. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  // Update task status via backend
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await studentService.updateTaskStatus(taskId, newStatus);
      await fetchTasks(); // Refresh tasks after update
      showSuccess('Task status updated successfully!');
    } catch (err) {
      console.error('Failed to update task status:', err);
      showError('Failed to update task status. Try again.');
    }
  };

  // Filter tasks based on selected status (CLIENT-SIDE FILTERING)
  const getFilteredTasks = () => {
    if (selectedStatus === 'All') {
      return tasks;
    }
    
    return tasks.filter(task => 
      task.status && task.status.toLowerCase() === selectedStatus.toLowerCase()
    );
  };

  // Group tasks by module (like JavaScript version)
  const groupTasksByModule = (tasksToGroup) => {
    const modulesMap = {};
    
    tasksToGroup.forEach(task => {
      if (!modulesMap[task.moduleName]) {
        modulesMap[task.moduleName] = [];
      }
      modulesMap[task.moduleName].push(task);
    });
    
    return modulesMap;
  };

  const filteredTasks = getFilteredTasks();
  const tasksByModule = groupTasksByModule(filteredTasks);

  return (
    <div className="student-portal">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark p-3">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">
            <i className="bi bi-person me-2"></i>
            Educore Student Portal
          </span>
          <div className="d-flex align-items-center">
            <span className="text-white me-3">Welcome, {user?.name || 'Student'}</span>
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

      <div className="d-flex">
        {/* Sidebar */}
        <aside className="bg-light sidebar p-3">
          <h6 className="fw-bold text-uppercase mb-3">Dashboard</h6>
          <Nav className="flex-column">
            <Nav.Link href="#tasks" className="active">
              <i className="bi bi-list-task me-2"></i>
              My Tasks
            </Nav.Link>
          </Nav>
        </aside>

        {/* Main Content */}
        <main className="p-4 flex-grow-1">
          <h3 className="mb-4">Student Dashboard</h3>

          {/* Tasks Section */}
          <section id="tasks">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">My Tasks (by Module)</h5>
                <div className="d-flex align-items-center">
                  <Form.Select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{ width: 'auto' }}
                    className="form-select-sm me-2"
                  >
                    <option value="All">All Statuses</option>
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Form.Select>
                </div>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading tasks...</p>
                  </div>
                ) : (
                  <Table striped bordered hover className="align-middle">
                    <thead>
                      <tr>
                        <th>Module</th>
                        <th>Task Name</th>
                        <th>Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(tasksByModule).length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center">
                            {tasks.length === 0 ? 'No tasks found' : 'No tasks match this filter'}
                          </td>
                        </tr>
                      ) : (
                        Object.entries(tasksByModule).map(([moduleName, moduleTasks]) => (
                          <React.Fragment key={moduleName}>
                            {/* Module header row */}
                            <tr className="table-primary">
                              <td colSpan="4" style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                                {moduleName}
                              </td>
                            </tr>
                            {/* Tasks for this module */}
                            {moduleTasks.map(task => (
                              <tr key={task.taskId}>
                                <td></td>
                                <td>{task.name}</td>
                                <td>
                                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                                </td>
                                <td>
                                  <Form.Select
                                    value={task.status}
                                    onChange={(e) => updateTaskStatus(task.taskId, e.target.value)}
                                    size="sm"
                                  >
                                    {statusOptions.map(option => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </Form.Select>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))
                      )}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
};

export default StudentPortal;