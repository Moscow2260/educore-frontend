import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Badge, InputGroup } from 'react-bootstrap';
import adminService from '../../../services/adminService';
import { showError } from '../../../utils/toast';

const LecturersManagement = () => {
  const [lecturers, setLecturers] = useState([]);
  const [filteredLecturers, setFilteredLecturers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    staffNumber: '',
    name: '',
    surname: '',
    email: '',
    phoneNumber: ''
  });

  useEffect(() => {
    loadLecturers();
  }, []);

  useEffect(() => {
    const filtered = lecturers.filter(lecturer =>
      lecturer.staffNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLecturers(filtered);
  }, [searchTerm, lecturers]);

  const loadLecturers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getLecturers();
      setLecturers(data);
      setFilteredLecturers(data);
    } catch (error) {
      // Error handled in service
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedLecturer) {
        await adminService.updateLecturer(selectedLecturer.lecturerId, formData);
      } else {
        await adminService.createLecturer(formData);
      }
      setShowModal(false);
      resetForm();
      loadLecturers();
    } catch (error) {
      // Error handled in service
    }
  };

  const handleDelete = async (lecturerId) => {
    if (window.confirm('Are you sure you want to delete this lecturer?')) {
      try {
        await adminService.deleteLecturer(lecturerId);
        loadLecturers();
      } catch (error) {
        // Error handled in service
      }
    }
  };

  const resetForm = () => {
    setSelectedLecturer(null);
    setFormData({
      staffNumber: '',
      name: '',
      surname: '',
      email: '',
      phoneNumber: ''
    });
  };

  const openEditModal = (lecturer) => {
    setSelectedLecturer(lecturer);
    setFormData({
      staffNumber: lecturer.staffNumber || '',
      name: lecturer.name || '',
      surname: lecturer.surname || '',
      email: lecturer.email || '',
      phoneNumber: lecturer.phoneNumber || ''
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <i className="bi bi-person-badge me-2"></i>
          Lecturers Management
          <Badge bg="light" text="dark" className="ms-2">
            {filteredLecturers.length}
          </Badge>
        </h5>
        <Button variant="light" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-1"></i>
          Add Lecturer
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
                placeholder="Search lecturers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>

        {/* Lecturers Table */}
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Staff #</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Email</th>
                <th>Phone</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLecturers.map(lecturer => (
                <tr key={lecturer.lecturerId}>
                  <td>{lecturer.staffNumber}</td>
                  <td>{lecturer.name}</td>
                  <td>{lecturer.surname}</td>
                  <td>{lecturer.email}</td>
                  <td>{lecturer.phoneNumber}</td>
                  <td className="text-center">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="me-1"
                      onClick={() => openEditModal(lecturer)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(lecturer.lecturerId)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {filteredLecturers.length === 0 && !loading && (
            <div className="text-center text-muted py-4">
              <i className="bi bi-person-x display-4"></i>
              <p className="mt-2">No lecturers found</p>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedLecturer ? 'Edit Lecturer' : 'Add New Lecturer'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Staff Number *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.staffNumber}
                      onChange={(e) => setFormData({...formData, staffNumber: e.target.value})}
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
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : (selectedLecturer ? 'Update Lecturer' : 'Create Lecturer')}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default LecturersManagement;