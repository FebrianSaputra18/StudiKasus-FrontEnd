import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const Product = () => {
  const token = localStorage.getItem("authToken");
  console.log(token, "token dari localStorage");
  const [userData, setUserData] = useState(null);
  const [dataProduct, setDataProduct] = useState([]);
  const [refetchIndicator, setRefetchIndicator] = useState(false);

  const full_name = localStorage.getItem("authName");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchDataDelivery = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDataProduct(response.data.data);
        console.log(" Success getting data Address", response.data.data);
      } catch (error) {
        console.error("Error getting address data", error);
      }
    };
    fetchDataDelivery();
  }, [token, refetchIndicator]);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/products/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Data sudah ilang", response.data);
        setRefetchIndicator((prevValue) => !prevValue);
        toast.success("Successfully delete address!");
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    } else {
      console.log("Deletion canceled.");
    }
  };
  return (
    <>
      {userData ? (
        <p>Login dulu laa ..</p>
      ) : (
        <>
          <Toaster
            position="right"
            reverseOrder={false}
            gutter={1}
            containerClassName=""
            containerStyle={{
              marginBottom: "7rem",
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
          <Col lg="12" className="flex-coloum pb-2">
            <h5 style={{ fontWeight: 600 }}>
              Product <span style={{ color: "red" }}> {full_name} !</span>{" "}
            </h5>
            <Link to={"/add-product"}>
              <button className="btn btn-sm btn-success">
                <i className="bi bi-plus-circle pe-2"></i>
                Create Product
              </button>
            </Link>
          </Col>
          <Col lg="12">
            <Table striped bordered hover responsive style={{ fontSize: 14 }}>
              <thead className="text-center fw-semibold">
                <tr>
                  <th>No</th>
                  <th>Name Product</th>
                  <th>Price</th>
                  <th>Category</th>
                  {/* <th>Tag</th> */}
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataProduct?.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>Rp. {item.price}</td>
                    <td>{item.category?.name || "nothing"}</td>
                    {/* <td>{item.tags?.name || "nothing"}</td> */}

                    <td className="d-flex justify-content-center">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-danger btn-sm"
                      >
                        delete
                      </button>
                      <button className="btn btn-info btn-sm mx-2">
                        detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </>
      )}
    </>
  );
};

export default Product;
