import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Heroine from "../assets/foodhero.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getCart } from "../redux/actions/actionCart";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const HomePage = () => {
  const carts = useSelector((state) => state.cart.cartItems);

  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [dataTags, setDataTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getTags = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tags`);
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        let actualData = await response.json();
        setDataTags(actualData.data);
      } catch (error) {
        setDataTags(null);
      }
    };
    getTags();
  }, []);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products`);
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        let actualData = await response.json();
        setData(actualData.data);
      } catch (err) {
        setData(null);
      }
    };
    getData();
  }, []);
  //redux
  const dispatch = useDispatch();

  const handleAddToCart = (_id) => {
    //  _id item yang terkait dengan tombol yang diklik
    const selectedItem = data.find((item) => item._id === _id);

    if (selectedItem) {
      const cartPayload = carts.map(({ product, qty }) => ({
        productId: product._id,
        qty: product._id === _id ? qty + 1 : qty,
      }));
      console.log(cartPayload, "Add Successfully");

      const isProductExistOnCart = cartPayload.some(
        ({ productId }) => productId === _id
      );
      if (!isProductExistOnCart) cartPayload.push({ productId: _id, qty: 1 });

      dispatch(addToCart(cartPayload))
        .unwrap()
        .then(() => {
          dispatch(getCart());
          toast.success("Successfully added to cart!");
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          toast.error("Failed to add to cart! Login dulu");
          setTimeout(() => {
            navigate("/login");
          },3000);
        });
    } else {
      console.error("Item not found");
      toast.error("Item not found!");
    }
  };

  useEffect(() => {
    dispatch(getCart());
  }, []);

  // const cartItems = useSelector((state) => state.cart.cartItems);
  // const totalItems = cartItems.length;

  return (
    <div className="homepage">
      <Toaster
        position="right"
        reverseOrder={false}
        gutter={1}
        containerClassName=""
        containerStyle={{
          marginBottom: "2.7rem",
          marginRight: "6.2rem",
        }}
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
                Promo! <br /> Buy 1 Get <br /> <span>Me Hehehe ..</span>
              </h1>
              <p className="mb-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Possimus alias aliquam, asperiores maxime repellat iure natus
                temporibus eligendi maiores labore!
              </p>
            </Col>
            <Col lg="6" className="pt-lg-0 pt-5">
              <img src={Heroine} alt="heh" />
            </Col>
          </Row>
        </Container>
      </header>
      <div className="product w-100 min-vh-100">
        <Container>
          <Row>
            <Col>
              <h1 className="text-center fw-bold">Check out all Promo !</h1>
            </Col>
          </Row>
          <Row className="d-flex align-items-center justify-content-center">
            <Col lg="12" style={{ display: "contents" }}>
              <Form.Control
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="search mr-sm-2 d-flex"
              />
            </Col>
          </Row>
          <Row>
            <Col className="d-flex mt-4">
              <p>Category : </p>
              {dataTags?.map((item) => (
                <div key={item._id}>
                  <button style={{ marginLeft: 10 }} className="btn btn-danger">
                    {item.name}
                  </button>
                </div>
              ))}
            </Col>
          </Row>
          <Row className="mt-5 d-flex align-items-center justify-content-center">
            {data?.map((item) => (
              <Col lg="3" md="4" sm="6" key={item._id} className="mt-5">
                <Card>
                  <Card.Img
                    style={{
                      marginBottom: "-1rem",
                      minHeight: "14rem",
                      maxHeight: "13rem",
                      objectFit: "cover",
                    }}
                    variant="top"
                    src={`http://localhost:3000/images/products/${item.image_url}`}
                  />
                  <Card.Body
                    style={{
                      background: "#dc3545",
                      padding: "10px 0.1px 0.1px 0.1px ",
                      borderRadius: "15px 15px 0px 0px",
                    }}
                  >
                    <Card.Title
                      style={{
                        height: "1.5rem",
                        color: "white",
                        fontWeight: 600,
                        fontSize: 16,
                        paddingLeft: 20,
                      }}
                    >
                      {item.name}
                    </Card.Title>
                    <Card.Body
                      style={{
                        background: "white",
                        borderRadius: "15px 15px 0px 0px",
                      }}
                    >
                      <p className="btn btn-sm bg-danger text-light">
                        <i className="bi bi-tag"> </i>
                        {item.category?.name || "nothing"}
                      </p>
                      <Card.Text style={{ color: "grey" }}>
                        <i className="bi bi-dash"></i> {item.description}
                      </Card.Text>
                      <Card.Text style={{ color: "green" }}>
                        Rp. {item.price}
                      </Card.Text>
                      <button
                        onClick={() => handleAddToCart(item._id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        add to Cart now! <i className="bi bi-bag-check"></i>
                      </button>
                    </Card.Body>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      <Link to="/shop">
        <div className="shopping-cart" onClick={() => navigate("/cart")}>
          <button>
            <i className="bi bi-cart-check"></i>
          </button>
          <p>{carts?.length ? <span>{carts.length}</span> : <></>}</p>
        </div>
      </Link>
    </div>
  );
};

export default HomePage;
