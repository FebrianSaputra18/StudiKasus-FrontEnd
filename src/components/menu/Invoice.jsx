import { Col, Form, Row } from "react-bootstrap";

const Invoice = () => {
  return (
    <div>
      <h3>Billing Details</h3>
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          Status
        </Form.Label>
        <Col sm="10">
        </Col>
      </Form.Group>
      {/* <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          Order ID
        </Form.Label>
        <Col sm="10">
          <Form.Label column sm="10">
          </Form.Label>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          total Amount
        </Form.Label>
        <Col sm="10">
          <Form.Label column sm="10">
          </Form.Label>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          billed to
        </Form.Label>
        <Col sm="10">
          <Form.Label column sm="10">
          </Form.Label>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          payment to
        </Form.Label>
        <Col sm="10">
          <Form.Label column sm="10">
          </Form.Label>
        </Col>
      </Form.Group> */}
    </div>
  );
}

export default Invoice