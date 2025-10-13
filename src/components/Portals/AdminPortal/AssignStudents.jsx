import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Badge } from 'react-bootstrap';
import adminService from '../../../services/adminService';
import { showError } from '../../../utils/toast';

const AssignStudents = () => {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: ''
  });

  useEffect(() => {
    loadAssignments();
    loadStudentsAndCourses();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const coursesData = await adminService.getCourses();
      const assignmentsData = [];

      for (const course of coursesData) {
        try {
          const enrolledStudents = await adminService.getEnrolledStudents(course.courseId);
          enrolledStudents.forEach(student => {
            assignmentsData.push({
              assignmentId: `${student.studentId}-${course.courseId}`,
              studentId: student.studentId,
              studentName: `${student.name} ${student.surname}`,
              studentNumber: student.studentNumber,
              courseId: course.courseId,
              courseName: course.name,
              enrollmentDate: student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'
            });
          });
        } catch (error) {
          // Skip if no students enrolled (404)
        }
      }

      setAssignments(assignmentsData);
    } catch (error) {
      // Error handled in service
    } finally {
      setLoading(false);
    }
  };

  const loadStudentsAndCourses = async () => {
    try {
      const [studentsData, coursesData] = await Promise.all([
        adminService.getStudents(),
        adminService.getCourses()
      ]);
      setStudents(studentsData);
      setCourses(coursesData);
    } catch (error) {
      // Error handled in service
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if student is already enrolled
      const alreadyAssigned = assignments.some(a => 
        a.studentId == formData.studentId && a.courseId == formData.courseId
      );
      
      if (alreadyAssigned) {
        alert('This student is already enrolled in the selected course.');
        return;
      }

      await adminService.assignStudentToCourse(formData.courseId, formData.studentId);
      setShowModal(false);
      setFormData({ studentId: '', courseId: '' });
      loadAssignments();
    } catch (error) {
      // Error handled in service
    }
  };

  const handleRemove = async (studentId, courseId) => {
    if (window.confirm('Are you sure you want to remove this student from the course?')) {
      try {
        await adminService.removeStudentFromCourse(courseId, studentId);
        loadAssignments();
      } catch (error) {
        // Error handled in service
      }
    }
  };

  const openModal = () => {
    setFormData({ studentId: '', courseId: '' });
    setShowModal(true);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-secondary text-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <i className="bi bi-people-fill me-2"></i>
          Assign Students to Courses
          <Badge bg="light" text="dark" className="ms-2">
            {assignments.length}
          </Badge>
        </h5>
        <Button variant="light" onClick={openModal}>
          <i className="bi bi-plus-circle me-1"></i>
          Assign Student
        </Button>
      </Card.Header>
      
      <Card.Body>
        {/* Assignments Table */}
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Enrollment Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(assignment => (
                <tr key={assignment.assignmentId}>
                  <td>
                    <strong>{assignment.studentName}</strong>
                    <br />
                    <small className="text-muted">{assignment.studentNumber}</small>
                  </td>
                  <td>
                    <strong>{assignment.courseName}</strong>
                  </td>
                  <td>
                    <small className="text-muted">{assignment.enrollmentDate}</small>
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemove(assignment.studentId, assignment.courseId)}
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
              <i className="bi bi-people display-4"></i>
              <p className="mt-2">No student assignments found</p>
            </div>
          )}
        </div>

        {/* Assign Student Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Assign Student to Course</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Select Student *</Form.Label>
                <Form.Select
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  required
                >
                  <option value="">Choose a student...</option>
                  {students.map(student => (
                    <option key={student.studentId} value={student.studentId}>
                      {student.name} {student.surname} ({student.studentNumber})
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
              <Button variant="secondary" type="submit" disabled={loading}>
                {loading ? 'Assigning...' : 'Assign Student'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default AssignStudents;