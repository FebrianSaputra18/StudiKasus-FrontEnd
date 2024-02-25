import { useEffect, useState } from "react";
import { Card, Col, ListGroup, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToOrder, getCart } from "../../redux/actions/actionRedux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const [addressData, setAddressData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const token = localStorage.getItem("authToken");

  const full_name = localStorage.getItem("authName");
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let total = 0;

  useEffect(() => {
    dispatch(getCart());
  }, []);

  useEffect(() => {
    const fetchDataDelivery = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/delivery-addresses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAddressData(response.data.data);
        console.log(" Success getting data Address", response.data.data);
      } catch (error) {
        console.error("Error getting address data", error);
      }
    };
    fetchDataDelivery();
  }, [token]);

  const handleAddAddressClick = () => {
    setShowModal(true);
  };
  const handlePayment = async(e) => {
    e.preventDefault();
    const cartItems = await dispatch(getCart())
    const deliveryFee = 0;
    const deliveryAddress = selectedAddress;
    const dataOrder = {
      delivery: deliveryFee,
      delivery_address: deliveryAddress,
      cart: cartItems,
    };
    const response = await dispatch(addToOrder(dataOrder))
    navigate(`/invoice/${response.payload.order._id}`);
  }

  const handleClose = () => setShowModal(false);
  const handleAddressSelection = (selectedAddress) => {
    setSelectedAddress(selectedAddress);

    // Close the modal
    setShowModal(false);
  };
  console.log(cartItems, " OrderCart");
  console.log(addressData, " OrderAddress");
  return (
    <>
      <Col lg="12" className="flex-coloum pb-2">
        <h5 style={{ fontWeight: 600 }}>
          Order <span style={{ color: "red" }}> {full_name} !</span>{" "}
        </h5>
      </Col>
      <Col lg="12">
        <Row>
          <Card style={{ width: "25rem" }}>
            <Card.Body className="p-0" style={{ background: "gray" }}>
              <h5
                className="mb-1"
                style={{
                  fontWeight: 600,
                  background: "white",
                  padding: "15px",
                }}
              >
                {" "}
                <i
                  className="bi bi-credit-card-fill "
                  style={{ color: "#dc3545" }}
                ></i>{" "}
                Checkout
              </h5>
              {selectedAddress ? (
                <div
                  className="d-flex mb-1"
                  style={{ background: "white", padding: "15px" }}
                >
                  <i className="bi bi-geo-alt"></i>
                  <div className="ps-2">
                    <p>
                      {selectedAddress.nama} | {selectedAddress.kelurahan},{" "}
                      {selectedAddress.kecamatan}, {selectedAddress.kabupaten},{" "}
                      {selectedAddress.provinsi}
                    </p>
                  </div>
                  <i
                    onClick={handleAddAddressClick}
                    className="bi bi-pencil-square"
                    style={{ cursor: "pointer", color: "#dc3545" }}
                  ></i>
                </div>
              ) : (
                <div className="text-center justify-content-center rounded-2 py-5">
                  <button
                    className="btn btn-danger rounded-5"
                    onClick={handleAddAddressClick}
                  >
                    <i className="bi bi-plus-circle"></i>
                  </button>
                  <p>Add Address</p>
                </div>
              )}

              {cartItems?.map((item) => (
                <ListGroup key={item._id} className="list-group-flush">
                  <ListGroup.Item>
                    {item.name} x {item.qty}
                  </ListGroup.Item>
                </ListGroup>
              ))}

              <Modal show={showModal} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                  <Modal.Title>Delivery Address</Modal.Title>
                </Modal.Header>
                {addressData.map((item) => (
                  <button
                    style={{ border: "none", textAlign: "start" }}
                    key={item._id}
                    onClick={() => handleAddressSelection(item)}
                  >
                    <p>
                      {item.nama} | {item.kelurahan}, {item.kecamatan},{" "}
                      {item.kabupaten}, {item.provinsi}
                    </p>
                    <hr />
                  </button>
                ))}
              </Modal>
            </Card.Body>
          </Card>
          <Card style={{ width: "25rem", marginLeft: "20px" }}>
            <Card.Body className="p-0">
              <h5
                className="mb-1"
                style={{
                  fontWeight: 600,
                  background: "white",
                  padding: "15px",
                }}
              >
                Total Keseluruhan
              </h5>
              {cartItems?.map((item) => {
                const subtotal = item.price * item.qty;
                total += subtotal;
                })}
                <h1 >Rp. {total}</h1>

                <button onClick={handlePayment} className="btn btn-success">payment</button>
            </Card.Body>
          </Card>
        </Row>
      </Col>
    </>
  );
};

export default Order;
