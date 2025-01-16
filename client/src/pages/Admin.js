import React, { useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import CreateBrand from "../components/models/CreateBrand";
import CreateDevice from "../components/models/CreateDevice";
import CreateType from "../components/models/CreateType";
import OrderBar from "../components/OrderBar";

const Admin = () => {
  const [brandVisible, setBrandVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [deviceVisible, setDeviceVisible] = useState(false);

  return (
    <Container className="d-flex flex-column">
      <Row className="mb-4">
        <Col>
          <Button variant="outline-dark" onClick={() => setBrandVisible(true)} className="w-100 mb-2">Add Brand</Button>
        </Col>
        <Col>
          <Button variant="outline-dark" onClick={() => setTypeVisible(true)} className="w-100 mb-2">Add Type</Button>
        </Col>
        <Col>
          <Button variant="outline-dark" onClick={() => setDeviceVisible(true)} className="w-100 mb-2">Add Device</Button>
        </Col>
      </Row>
      <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
      <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
      <CreateDevice show={deviceVisible} onHide={() => setDeviceVisible(false)} />
      <OrderBar />
    </Container>
  );
};

export default Admin;
