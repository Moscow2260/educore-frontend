// UserListing.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, Tab, Table, Form, Spinner } from 'react-bootstrap';

const UserListing = () => {
  const [activeTab, setActiveTab] = useState('lecturers');
  const [lecturers, setLecturers] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchUsers('lecturers');
    fetchUsers('students');
  }, []);

  const fetchUsers = async (type) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://localhost:7065/api/Admin/${type}`);
      if (type === 'lecturers') setLecturers(response.data);
      else setStudents(response.data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Filtered lists based on search
  const filteredLecturers = lecturers.filter(
    lec =>
      lec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lec.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lec.staffNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(
    st =>
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h4>User Listing</h4>

      <Form.Control
        type="text"
        placeholder="Search users..."
        className="mb-3"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Tabs
          activeKey={activeTab}
          onSelect={k => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="lecturers" title={`Lecturers (${lecturers.length})`}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Lecturer ID</th>
                  <th>Staff #</th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {filteredLecturers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No lecturers found.
                    </td>
                  </tr>
                ) : (
                  filteredLecturers.map(lec => (
                    <tr key={lec.lecturerId}>
                      <td>{lec.lecturerId}</td>
                      <td>{lec.staffNumber}</td>
                      <td>{lec.name}</td>
                      <td>{lec.surname}</td>
                      <td>{lec.email || 'N/A'}</td>
                      <td>{lec.phoneNumber || 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Tab>

          <Tab eventKey="students" title={`Students (${students.length})`}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student #</th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Gender</th>
                  <th>Date of Birth</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Home Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(st => (
                    <tr key={st.studentId}>
                      <td>{st.studentId}</td>
                      <td>{st.studentNumber}</td>
                      <td>{st.name}</td>
                      <td>{st.surname}</td>
                      <td>{st.gender || 'N/A'}</td>
                      <td>{st.dateOfBirth ? new Date(st.dateOfBirth).toLocaleDateString() : 'N/A'}</td>
                      <td>{st.email || 'N/A'}</td>
                      <td>{st.phoneNumber || 'N/A'}</td>
                      <td>{st.homeAddress || 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Tab>
        </Tabs>
      )}
    </div>
  );
};

export default UserListing;
