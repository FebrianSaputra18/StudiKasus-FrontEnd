import { useEffect, useState } from "react";
import { Col, Form, Modal, Row, Table } from "react-bootstrap";
import { createDispatchHook, useDispatch, useSelector } from "react-redux";
import { addToCart, addToOrder, getCart } from "../../redux/actions/actionRedux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllCart = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  let delivery = 25000;
  localStorage.setItem("deliveryTotal", delivery.toString());

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 2));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex < 2 ? prevIndex + 1 : 0));
  };
  const handleAddressSelection = (address) => {
    setSelectedAddress(address);
  };

  const sections = [
    <ProductSection key="1" />,
    <AddressSection key="2" onAddressSelection={handleAddressSelection} />,
    <BillingSection key="3" selectedAddress={selectedAddress} />,
  ];

  const currentSection = sections[currentIndex];

  return (
    <div>
      <h2>Your Shopping Cart</h2>
      <div className="d-flex justify-content-end">
        {/* Navigation buttons for the carousel */}
        <button
          className="btn btn-danger"
          onClick={handlePrevClick}
          style={{ display: currentIndex === 0 ? "none" : "block" }}
        >
          Prev
        </button>
        <button
          className="btn btn-info"
          onClick={handleNextClick}
          style={{ display: currentIndex === 2 ? "none" : "block" }}
        >
          Next
        </button>
      </div>
      {currentSection}
    </div>
  );
};

const ProductSection = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  let total = 0;
  const handleIncreaseDecrease = (cartId, increase = true) => {
    const selectedItem = cartItems.find((cartItem) => cartItem._id === cartId);
    if (selectedItem) {
      const cartPayload = cartItems
        .map(({ _id, product, qty }) => {
          let nextQty = qty;
          if (_id === cartId) {
            if (increase) nextQty += 1;
            else nextQty -= 1;
          }

          return {
            productId: product._id,
            qty: nextQty,
          };
        })
        .filter(({ qty }) => qty >= 1); // hapus item yg qtynya kurang dari 1

      console.log(cartPayload, cartItems, selectedItem, "Add Successfully");
      // return;

      dispatch(addToCart(cartPayload))
        .unwrap()
        .then(() => {
          dispatch(getCart());
          toast.success("Successfully added to cart!");
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          toast.error("Failed to add to cart! Login dulu");
          // setTimeout(() => {
          //   navigate("/login");
          // },3000);
        });
    } else {
      console.error("Item not found");
      toast.error("Item not found!");
    }
  };

  useEffect(() => {
    dispatch(getCart());
  }, []);

  const calculateTotal = () => {
    if (!cartItems) {
      return 0; // or any default value you prefer
    }
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    // Simpan total ke dalam local storage
    localStorage.setItem("cartTotal", total.toString());

    return total;
  };

  console.log(cartItems, "Carts");

  return (
    <div>
      <Table
        className="text-center fw-semibold"
        striped
        bordered
        hover
        responsive
        style={{ fontSize: 14 }}
      >
        <thead>
          <tr>
            <th>No</th>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cartItems?.map((item, index) => {
            const subtotal = item.price * item.qty;
            total += subtotal;

            return (
              <tr key={item._id} className="align-baseline">
                <td>{index + 1}</td>
                <td>
                  <img
                    style={{ width: "5rem", paddingRight: 5 }}
                    src={`http://localhost:3000/images/products/${item.Image_url}`}
                    alt=""
                  />
                  {item.name}
                </td>
                <td style={{ color: "red" }}>Rp. {item.price}</td>
                <td>
                  <button
                    onClick={() => handleIncreaseDecrease(item._id, false)} // Misalnya, pengurangan 1 unit
                    className="btn btn-sm btn-danger me-2"
                  >
                    -
                  </button>
                  {item.qty}
                  <button
                    onClick={() => handleIncreaseDecrease(item._id)} // Misalnya, penambahan 1 unit
                    className="btn btn-sm btn-success ms-2"
                  >
                    +
                  </button>
                </td>
                <td style={{ color: "red" }}>Rp. {subtotal}</td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={4}>Total</td>
            <td style={{ color: "green" }}>Rp. {calculateTotal()}</td>
          </tr>
        </tbody>
      </Table>
      {/* Render product information here */}
    </div>
  );
};

const AddressSection = ({ onAddressSelection }) => {
  const [addressData, setAddressData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const token = localStorage.getItem("authToken");

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

  const handleClose = () => setShowModal(false);
  const handleAddressSelection = (selectedAddress) => {
    setSelectedAddress(selectedAddress);
    onAddressSelection(selectedAddress);

    localStorage.setItem("address", JSON.stringify(selectedAddress));

    // Close the modal
    setShowModal(false);
  };
  console.log(addressData, " OrderAddress");
  return (
    <div>
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
              {item.nama} | {item.kelurahan}, {item.kecamatan}, {item.kabupaten}
              , {item.provinsi}
            </p>
            <hr />
          </button>
        ))}
      </Modal>
    </div>
  );
};

const BillingSection = ({ selectedAddress }) => {
  const deliveryFee = localStorage.getItem("deliveryTotal");
  const totalAll = localStorage.getItem("cartTotal");
  const cartTotal = parseFloat(totalAll) || 0;
  const delivery = parseFloat(deliveryFee) || 0;
  const navigate = useNavigate()
  const dispatch = useDispatch();


  const totalAmount = cartTotal + delivery;

  const handlePayment = async(e) => {
    e.preventDefault();
    const cartItems = await dispatch(getCart())
    const deliveryFee = 25000;
    const deliveryAddress = selectedAddress;
    const dataOrder = {
      delivery_fee: deliveryFee,
      delivery_address: deliveryAddress,
      cart: cartItems.payload,
    };
    const response = await dispatch(addToOrder(dataOrder))
    navigate(`/invoice/${response.payload.order._id}`);
  }
  return (
    <div>
      <h3>Billing Details</h3>
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          Alamat
        </Form.Label>
        <Col sm="10">
          {selectedAddress ? (
            <Form.Label column sm="10">
              <strong> {selectedAddress.nama}</strong> |{" "}
              {selectedAddress.kelurahan}, {selectedAddress.kecamatan},{" "}
              {selectedAddress.kabupaten}, {selectedAddress.provinsi}
            </Form.Label>
          ) : (
            <p>Pilih alamat terlebih dahulu</p>
          )}
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          Subtotal
        </Form.Label>
        <Col sm="10">
          <Form.Label column sm="10">
            {totalAll}
          </Form.Label>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          Ongkir
        </Form.Label>
        <Col sm="10">
          <Form.Label column sm="10">
            {deliveryFee}
          </Form.Label>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          Total
        </Form.Label>
        <Col sm="10">
          <Form.Label column sm="10">
            {totalAmount}
          </Form.Label>
        </Col>
      </Form.Group>
      <div className="d-flex ">
        <button className="btn btn-success" onClick={handlePayment}>
          Payment
        </button>
      </div>
    </div>
  );
};
export default AllCart;
