import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Badge } from 'react-bootstrap';
import adminService from '../../../services/adminService';
import { showError } from '../../../utils/toast';

const AssignLecturers = () => {
  const [assignments, setAssignments] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    lecturerId: '',
    courseId: ''
  });

  useEffect(() => {
    loadAssignments();
    loadLecturersAndCourses();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const coursesData = await adminService.getCourses();
      const assignmentsData = [];

      for (const course of coursesData) {
        try {
          const lecturer = await adminService.getAssignedLecturer(course.courseId);
          if (lecturer) {
            assignmentsData.push({
              assignmentId: course.courseId,
              courseId: course.courseId,
              courseName: course.name,
              lecturerId: lecturer.lecturerId,
              lecturerName: `${lecturer.name} ${lecturer.surname}`,
              staffNumber: lecturer.staffNumber
            });
          }
        } catch (error) {
          // Skip if no lecturer assigned (404)
        }
      }

      setAssignments(assignmentsData);
    } catch (error) {
      // Error handled in service
    } finally {
      setLoading(false);
    }
  };

  const loadLecturersAndCourses = async () => {
    try {
      const [lecturersData, coursesData] = await Promise.all([
        adminService.getLecturers(),
        adminService.getCourses()
      ]);
      setLecturers(lecturersData);
      setCourses(coursesData);
    } catch (error) {
      // Error handled in service
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if course already has a lecturer
      const existingLecturer = await adminService.getAssignedLecturer(formData.courseId);
      if (existingLecturer) {
        alert(`This course is already assigned to ${existingLecturer.name} ${existingLecturer.surname}.`);
        return;
      }

      await adminService.assignLecturerToCourse(formData.courseId, formData.lecturerId);
      setShowModal(false);
      setFormData({ lecturerId: '', courseId: '' });
      loadAssignments();
    } catch (error) {
      // Error handled in service
    }
  };

  const handleRemove = async (courseId) => {
    if (window.confirm('Are you sure you want to remove the lecturer from this course?')) {
      try {
        await adminService.removeLecturerFromCourse(courseId);
        loadAssignments();
      } catch (error) {
        // Error handled in service
      }
    }
  };

  const openModal = () => {
    setFormData({ lecturerId: '', courseId: '' });
    setShowModal(true);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-info text-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <i className="bi bi-person-plus me-2"></i>
          Assign Lecturers to Courses
          <Badge bg="light" text="dark" className="ms-2">
            {assignments.length}
          </Badge>
        </h5>
        <Button variant="light" onClick={openModal}>
          <i className="bi bi-plus-circle me-1"></i>
          Assign Lecturer
        </Button>
      </Card.Header>
      
      <Card.Body>
        {/* Assignments Table */}
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Lecturer</th>
                <th>Course</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(assignment => (
                <tr key={assignment.assignmentId}>
                  <td>
                    <strong>{assignment.lecturerName}</strong>
                    <br />
                    <small className="text-muted">{assignment.staffNumber}</small>
                  </td>
                  <td>
                    <strong>{assignment.courseName}</strong>
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemove(assignment.courseId)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {assignments.length === 0 && !loading && (
            <div className="text-center text-muted py-4">
              <i className="bi bi-person-x display-4"></i>
              <p className="mt-2">No lecturer assignments found</p>
            </div>
          )}
        </div>

        {/* Assign Lecturer Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Assign Lecturer to Course</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Select Lecturer *</Form.Label>
                <Form.Select
                  value={formData.lecturerId}
                  onChange={(e) => setFormData({...formData, lecturerId: e.target.value})}
                  required
                >
                  <option value="">Choose a lecturer...</option>
                  {lecturers.map(lecturer => (
                    <option key={lecturer.lecturerId} value={lecturer.lecturerId}>
                      {lecturer.name} {lecturer.surname} ({lecturer.staffNumber})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Select Course *</Form.Label>
                <Form.Select
                  value={formData.courseId}
                  onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                  required
                >
                  <option value="">Choose a course...</option>
                  {courses.map(course => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="info" type="submit" disabled={loading}>
                {loading ? 'Assigning...' : 'Assign Lecturer'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default AssignLecturers;
