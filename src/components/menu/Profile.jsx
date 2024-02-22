// Profile.js
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data.user);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6} className="offset-md-3">
          <Card>
            <Card.Body>
              <Card.Title>Profile</Card.Title>
              {userData && (
                <>
                  <Card.Text>
                    <strong>Name:</strong> {userData.name}
                  </Card.Text>
                  <Card.Text>
                    <strong>Email:</strong> {userData.email}
                  </Card.Text>
                  {/* Add more user data fields as needed */}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
