import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Badge, InputGroup } from 'react-bootstrap';
import adminService from '../../../services/adminService';
import { showError } from '../../../utils/toast';

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentNumber: '',
    name: '',
    surname: '',
    gender: '',
    dateOfBirth: '',
    homeAddress: '',
    email: '',
    phoneNumber: ''
  });

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.studentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStudents();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      // Error handled in service
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedStudent) {
        await adminService.updateStudent(selectedStudent.studentId, formData);
      } else {
        await adminService.createStudent(formData);
      }
      setShowModal(false);
      resetForm();
      loadStudents();
    } catch (error) {
      // Error handled in service
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await adminService.deleteStudent(studentId);
        loadStudents();
      } catch (error) {
        // Error handled in service
      }
    }
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setFormData({
      studentNumber: '',
      name: '',
      surname: '',
      gender: '',
      dateOfBirth: '',
      homeAddress: '',
      email: '',
      phoneNumber: ''
    });
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      studentNumber: student.studentNumber || '',
      name: student.name || '',
      surname: student.surname || '',
      gender: student.gender || '',
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
      homeAddress: student.homeAddress || '',
      email: student.email || '',
      phoneNumber: student.phoneNumber || ''
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <i className="bi bi-people me-2"></i>
          Students Management
          <Badge bg="light" text="dark" className="ms-2">
            {filteredStudents.length}
          </Badge>
        </h5>
        <Button variant="light" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-1"></i>
          Add Student
        </Button>
      </Card.Header>
      
      <Card.Body>
        {/* Search Section */}
        <div className="row mb-3">
          <div className="col-md-6">
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>

        {/* Students Table */}
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Student #</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Gender</th>
                <th>Date of Birth</th>
                <th>Email</th>
                <th>Phone</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.studentId}>
                  <td>{student.studentNumber}</td>
                  <td>{student.name}</td>
                  <td>{student.surname}</td>
                  <td>{student.gender}</td>
                  <td>{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : ''}</td>
                  <td>{student.email}</td>
                  <td>{student.phoneNumber}</td>
                  <td className="text-center">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="me-1"
                      onClick={() => openEditModal(student)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(student.studentId)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {filteredStudents.length === 0 && !loading && (
            <div className="text-center text-muted py-4">
              <i className="bi bi-person-x display-4"></i>
              <p className="mt-2">No students found</p>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedStudent ? 'Edit Student' : 'Add New Student'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Student Number *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.studentNumber}
                      onChange={(e) => setFormData({...formData, studentNumber: e.target.value})}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </Form.Group>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Name *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Surname *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.surname}
                      onChange={(e) => setFormData({...formData, surname: e.target.value})}
                      required
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Gender *</Form.Label>
                    <Form.Select
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth *</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      required
                    />
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Home Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={formData.homeAddress}
                  onChange={(e) => setFormData({...formData, homeAddress: e.target.value})}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="success" type="submit" disabled={loading}>
                {loading ? 'Saving...' : (selectedStudent ? 'Update Student' : 'Create Student')}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default StudentsManagement;