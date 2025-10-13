import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Badge, InputGroup, Row, Col } from 'react-bootstrap';
import adminService from '../../../services/adminService';
import { showError } from '../../../utils/toast';

const CoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showModulesModal, setShowModulesModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseForm, setCourseForm] = useState({
    name: '',
    description: ''
  });
  const [moduleForm, setModuleForm] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCourses();
      setCourses(data);
    } catch (error) {
      // Error handled in service
    } finally {
      setLoading(false);
    }
  };

  const loadModules = async (courseId) => {
    try {
      const data = await adminService.getCourseModules(courseId);
      setModules(data);
    } catch (error) {
      // Error handled in service
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCourse) {
        await adminService.updateCourse(selectedCourse.courseId, courseForm);
      } else {
        await adminService.createCourse(courseForm);
      }
      setShowCourseModal(false);
      resetCourseForm();
      loadCourses();
    } catch (error) {
      // Error handled in service
    }
  };

  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedModule) {
        await adminService.updateModule(selectedModule.moduleId, moduleForm);
      } else {
        await adminService.createModule(selectedCourse.courseId, moduleForm);
      }
      setShowModuleModal(false);
      resetModuleForm();
      loadModules(selectedCourse.courseId);
    } catch (error) {
      // Error handled in service
    }
  };

  const deleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await adminService.deleteCourse(courseId);
        loadCourses();
      } catch (error) {
        // Error handled in service
      }
    }
  };

  const deleteModule = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      try {
        await adminService.deleteModule(moduleId);
        loadModules(selectedCourse.courseId);
      } catch (error) {
        // Error handled in service
      }
    }
  };

  const resetCourseForm = () => {
    setSelectedCourse(null);
    setCourseForm({
      name: '',
      description: ''
    });
  };

  const resetModuleForm = () => {
    setSelectedModule(null);
    setModuleForm({
      name: '',
      description: ''
    });
  };

  const openEditCourseModal = (course) => {
    setSelectedCourse(course);
    setCourseForm({
      name: course.name || '',
      description: course.description || ''
    });
    setShowCourseModal(true);
  };

  const openAddCourseModal = () => {
    resetCourseForm();
    setShowCourseModal(true);
  };

  const openModulesModal = async (course) => {
    setSelectedCourse(course);
    await loadModules(course.courseId);
    setShowModulesModal(true);
  };

  const openEditModuleModal = (module) => {
    setSelectedModule(module);
    setModuleForm({
      name: module.name || '',
      description: module.description || ''
    });
    setShowModuleModal(true);
  };

  const openAddModuleModal = () => {
    resetModuleForm();
    setShowModuleModal(true);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-warning text-dark d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <i className="bi bi-book me-2"></i>
          Courses Management
          <Badge bg="light" text="dark" className="ms-2">
            {courses.length}
          </Badge>
        </h5>
        <Button variant="light" onClick={openAddCourseModal}>
          <i className="bi bi-plus-circle me-1"></i>
          Add Course
        </Button>
      </Card.Header>
      
      <Card.Body>
        {/* Courses Table */}
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Course Name</th>
                <th>Description</th>
                <th>Modules</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.courseId}>
                  <td>
                    <strong>{course.name}</strong>
                  </td>
                  <td>{course.description}</td>
                  <td>
                    <Badge bg="info">
                      {course.modules?.length || 0} modules
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => openModulesModal(course)}
                    >
                      <i className="bi bi-list-check me-1"></i>
                      Modules
                    </Button>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="me-1"
                      onClick={() => openEditCourseModal(course)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteCourse(course.courseId)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {courses.length === 0 && !loading && (
            <div className="text-center text-muted py-4">
              <i className="bi bi-book display-4"></i>
              <p className="mt-2">No courses found</p>
            </div>
          )}
        </div>

        {/* Course Modal */}
        <Modal show={showCourseModal} onHide={() => setShowCourseModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedCourse ? 'Edit Course' : 'Add New Course'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleCourseSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Course Name *</Form.Label>
                <Form.Control
                  type="text"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowCourseModal(false)}>
                Cancel
              </Button>
              <Button variant="warning" type="submit" disabled={loading}>
                {loading ? 'Saving...' : (selectedCourse ? 'Update Course' : 'Create Course')}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Modules Management Modal */}
        <Modal show={showModulesModal} onHide={() => setShowModulesModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Manage Modules - {selectedCourse?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6>Course Modules</h6>
              <Button variant="primary" size="sm" onClick={openAddModuleModal}>
                <i className="bi bi-plus-circle me-1"></i>
                Add Module
              </Button>
            </div>

            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Module Name</th>
                  <th>Description</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {modules.map(module => (
                  <tr key={module.moduleId}>
                    <td>{module.name}</td>
                    <td>{module.description}</td>
                    <td className="text-center">
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="me-1"
                        onClick={() => openEditModuleModal(module)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteModule(module.moduleId)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {modules.length === 0 && (
              <div className="text-center text-muted py-3">
                <p>No modules found for this course</p>
              </div>
            )}
          </Modal.Body>
        </Modal>

        {/* Module Modal */}
        <Modal show={showModuleModal} onHide={() => setShowModuleModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedModule ? 'Edit Module' : 'Add New Module'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleModuleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Module Name *</Form.Label>
                <Form.Control
                  type="text"
                  value={moduleForm.name}
                  onChange={(e) => setModuleForm({...moduleForm, name: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModuleModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : (selectedModule ? 'Update Module' : 'Create Module')}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default CoursesManagement;