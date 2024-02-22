import { Col, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  getCart,
} from "../../redux/actions/actionCart";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Cart = ({ onButtonClick }) => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const full_name = localStorage.getItem("authName");
  let total = 0;

  const handleIncreaseDecrease = (cartId, increase = true) => {
    const selectedItem = cartItems.find((cartItem) => cartItem._id === cartId);
    if (selectedItem) {
      const cartPayload = cartItems.map(({ _id, product, qty }) => {
        let nextQty = qty
        if(_id === cartId){
          if(increase) nextQty += 1;
          else nextQty -= 1;
        }

        return {
          productId: product._id,
          qty: nextQty,
        }
      })
      .filter(({qty}) => qty >= 1); // hapus item yg qtynya kurang dari 1

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
  console.log(cartItems, "Carts");

  return (
    <>
      <Col lg="12" className="flex-coloum pb-2">
        <h5 style={{ fontWeight: 600 }}>
          Cart <span style={{ color: "red" }}> {full_name} !</span>{" "}
        </h5>
        <button className="btn btn-danger btn-sm">Remove All</button>
      </Col>
      <Col lg="12">
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
              <th>Remove</th>
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
                  <td>
                    <button className="btn btn-sm btn-danger">
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={5}>Total</td>
              <td style={{ color: "green" }}>Rp. {total}</td>
            </tr>
          </tbody>
        </Table>
        <button onClick={onButtonClick} className="btn btn-success btn-sm">
          <i className="bi bi-credit-card"></i> payment
        </button>
      </Col>
    </>
  );
};

export default Cart;
