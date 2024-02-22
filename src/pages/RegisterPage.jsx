import axios from "axios";
import { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "user",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const registrationData = {
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };
    try {
      await axios
        .post("http://localhost:3000/auth/register", registrationData)
        .then((response) => {
          console.log("Registration successful: ", response.data);
          setFormData({
            full_name: "",
            email: "",
            password: "",
            role: "user",
          });
          navigate('/login');
        })
        .catch((error) => {
          console.log("Registration failed: ", error);
        });
    } catch (error) {
      return error, "Registration failed: ", error;
    }
  };

  return (
    <div className="homepage">
      <header className="w-100 min-vh-100 d-flex align-items-center">
        <Container>
          <Row className="header-box d-flex align-items-center">
            <Col lg="6">
              <h1 className="mb-4">
                Regis! <br /> <span> dulu Hehehe ..</span>
              </h1>
            </Col>
            <Col lg="6" className="pt-lg-0 pt-5">
              <Form onSubmit={handleSubmit}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.full_name}
                    name="full_name"
                    onChange={handleChange}
                    placeholder="Full name .."
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    name="email"
                    onChange={handleChange}
                    placeholder="Email .."
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea2"
                >
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.password}
                    name="password"
                    onChange={handleChange}
                    placeholder="Password .."
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea3"
                >
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={formData.role}
                    name="role"
                    onChange={handleChange}
                    aria-label="Default select example"
                  >
                    <option>Chose u Role!</option>
                    <option value="user">User</option>
                    <option value="admin">Amin</option>
                  </Form.Select>
                </Form.Group>
                <button
                  type="submit"
                  className="btn btn-sm btn-danger btn-lg rounded-1 me-2"
                >
                  Register
                </button>
              </Form>
            </Col>
          </Row>
        </Container>
      </header>
    </div>
  );
};

export default RegisterPage;
