import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const Address = () => {
  const token = localStorage.getItem("authToken");
  console.log(token, "token dari localStorage");
  const [userData, setUserData] = useState(null);
  const [addressData, setAddressData] = useState([]);
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
  }, [token, refetchIndicator]);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );
    toast.remove(isConfirmed);

    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/delivery-addresses/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Data sudah ilang", response.data.address);
        setRefetchIndicator((prevValue) => !prevValue);
        toast.success("Successfully delete address!");
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    } else {
      console.log("Deletion canceled.");
    }
  };
  const handleCreate = () => {

  }
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
              Address <span style={{ color: "red" }}> {full_name} !</span>{" "}
            </h5>
            <Link to={"/add-address"}>
              <button className="btn btn-sm btn-success" onClick={handleCreate}>
                <i className="bi bi-plus-circle pe-2"></i>
                Create Address
              </button>
            </Link>
          </Col>
          <Col lg="12">
            <Table striped bordered hover responsive style={{ fontSize: 14 }}>
              <thead className="text-center fw-semibold">
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Kabupaten</th>
                  <th>Detail</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              
              <tbody>
                {addressData.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.nama}</td>
                    <td>{item.kabupaten}</td>
                    <td>{item.detail}</td>
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

export default Address;
