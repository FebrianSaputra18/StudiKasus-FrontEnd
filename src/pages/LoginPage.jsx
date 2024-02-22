import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({});

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      setTimeout(() => toast.success("anda sudah login!"), 3000);
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("ini result token", result.token);

        if (result.message === "Login Successfully") {
          const token = result.token;
          const email = result.user.email;
          const full_name = result.user.full_name;
          const role = result.user.role;
          localStorage.setItem("authToken", token);
          localStorage.setItem("authName", full_name);
          localStorage.setItem("authEmail", email);
          localStorage.setItem("authRole", role);
          toast.success("login! berhasil");

          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="homepage">
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={1}
        containerClassName=""
        // containerStyle={{
        //   marginBottom: "2.7rem",
        //   marginRight: "6.2rem",
        // }}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      <header className="w-100 min-vh-100 d-flex align-items-center">
        <Container>
          <Row className="header-box d-flex align-items-center">
            <Col lg="6">
              <h1 className="mb-4">
                Login! <br /> for Happy <br /> <span> with Me Hehehe ..</span>
              </h1>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    onChange={handleChange}
                    name="email"
                    type="email"
                    placeholder="Email .."
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    onChange={handleChange}
                    name="password"
                    type="password"
                    placeholder="Password .."
                  />
                </Form.Group>
                <button
                  onClick={handleLogin}
                  className="btn btn-sm btn-danger btn-lg rounded-1 me-2"
                >
                  Login
                </button>
              </Form>
            </Col>
            <Col lg="6" className="pt-lg-0 pt-5"></Col>
          </Row>
        </Container>
      </header>
    </div>
  );
};

export default LoginPage;
