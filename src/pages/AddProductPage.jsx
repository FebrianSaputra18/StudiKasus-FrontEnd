import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
const AddProductPage = () => {
  const token = localStorage.getItem("authToken");

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    tags: [],
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);

  const history = useNavigate();

  useEffect(() => {
    // Fetch categories and tags from the server
    const fetchData = async () => {
      const categoryResponse = await axios.get(
        "http://localhost:3000/api/categories",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const tagResponse = await axios.get("http://localhost:3000/api/tags", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categoryResponse.data.data);
      setTags(tagResponse.data.data);
    };

    fetchData();
  }, [token]);

  const handleCategoryChange = (selectedOption) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      category: selectedOption,
    }));
  };

  const handleTagsChange = (selectedOptions) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      tags: selectedOptions,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image_url", image);
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("category", product.category.value);
    formData.append(
      "tags",
      JSON.stringify(product.tags.map((tag) => tag.value))
    );

    try {
      await axios.post("http://localhost:3000/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Product added successfully");
      history("/");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="homepage">
      <header className="w-100 min-vh-100 d-flex align-items-center">
        <Container>
          <Row className="header-box">
            <Col lg="12">
              <h3 className="mb-4 text-center">
                Create! your <span style={{ color: "red" }}>product ... </span>
              </h3>
            </Col>
            <Form onSubmit={handleSubmit} className="d-flex">
              <Col lg="12" className="pt-lg-0 pt-5 row">
                <Form.Group className="mb-3" as={Col} lg="6" md="6" sm="12">
                  <Form.Label>Nama Product</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={(e) =>
                      setProduct({ ...product, name: e.target.value })
                    }
                    required
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" as={Col} lg="6" md="6" sm="12">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image_url"
                    onChange={handleImageChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please choose a images.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" as={Col} lg="6" md="6" sm="12">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={(e) =>
                      setProduct({ ...product, price: e.target.value })
                    }
                    required
                    placeholder="Price .."
                  />
                  <Form.Control.Feedback type="invalid">
                    Please set a price.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" as={Col} lg="6" md="6" sm="12">
                  <Form.Label column sm={2}>
                    Tag
                  </Form.Label>
                  <Select
                    options={tags.map((tag) => ({
                      value: tag._id,
                      label: tag.name,
                    }))}
                    value={product.tags}
                    isMulti
                    onChange={handleTagsChange}
                    placeholder="Select Tags ..."
                  ></Select>
                  <Form.Control.Feedback type="invalid">
                    Please choose a Tag.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" as={Col} lg="6" md="6" sm="12">
                  <Form.Label column sm={2}>
                    Category
                  </Form.Label>
                  <Select
                    options={categories.map((category) => ({
                      value: category._id,
                      label: category.name,
                    }))}
                    value={product.category}
                    onChange={handleCategoryChange}
                    autoFocus
                    placeholder="Select Category ..."
                  ></Select>
                  <Form.Control.Feedback type="invalid">
                    Please choose a Category.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" as={Col} lg="6" md="6" sm="12">
                  <Form.Check
                    required
                    id="done"
                    label="Agree to terms and conditions"
                    feedback="You must agree before submitting."
                    feedbackType="invalid"
                  />
                </Form.Group>
                <Form.Group className="mb-3" as={Col} lg="6" md="6" sm="12">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    name="description"
                    value={product.description}
                    onChange={(e) =>
                      setProduct({ ...product, description: e.target.value })
                    }
                    type="text"
                    as="textarea"
                    required
                    rows={3}
                    placeholder="Description .."
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <button
                  type="submit"
                  className="btn btn-sm btn-danger btn-lg rounded-1 me-2"
                >
                  Created!
                </button>
              </Col>
            </Form>
          </Row>
        </Container>
      </header>
    </div>
  );
};

export default AddProductPage;
