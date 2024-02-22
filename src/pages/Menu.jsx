import { Col, Container, Nav, Row, Tab } from "react-bootstrap";
import "../components/menu/style/menu.css";
import { useEffect, useState } from "react";

import Profile from "../components/menu/Profile";
import Address from "../components/menu/Address";
import Invoice from "../components/menu/Invoice";
import Cart from "../components/menu/Cart";
import Product from "../components/menu/Product";
import Category from "../components/menu/Category";

import { useNavigate } from "react-router-dom";
import Tag from "../components/menu/Tag";
import toast from "react-hot-toast";
import Order from "../components/menu/Order";

const Menu = () => {
  const [activeTab, setActiveTab] = useState("tab1")

  const handleCartButtonClick = () => {
    setActiveTab("tab5");
  };

  const handleTabSelect = (selectedTab) => {
    setActiveTab(selectedTab);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      return;
    } else {
      setTimeout(() => toast.success("anda belum login!"), 3000);
      navigate("/login");
    }
  }, [navigate]);



  const token = localStorage.getItem("authToken");
  console.log(token, "token dari localStorage");

  return (
    <div className="homepage">
      <header className="w-100 min-vh-100">
        <Container fluid>
          <Tab.Container id="left-tabs-example" activeKey={activeTab} onSelect={handleTabSelect}>
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="tab1">Profil</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab2">Address</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab3">Product</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab4">Cart</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab5">Order</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab6">Invoice</Nav.Link>
                  </Nav.Item>
                  <hr />
                  <Nav.Item>
                    <Nav.Link eventKey="tab7">Tag</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab8">Category</Nav.Link>
                  </Nav.Item>
                 
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="tab1">
                    <Profile />
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab2">
                    <Address />
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab3">
                    <Product />
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab4">
                    <Cart onButtonClick={handleCartButtonClick}/>
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab5">
                    <Order />
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab6">
                    <Invoice />
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab8">
                    <Tag />
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab9">
                    <Category />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      </header>
    </div>
  );
};

export default Menu;
