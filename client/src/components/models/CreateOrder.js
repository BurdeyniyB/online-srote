import React, { useContext, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Context } from "../..";

const CreateOrder = ({ show, onHide }) => {
  const { user, basket } = useContext(Context);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const addOrder = () => {
    const userId = user.user.id;
    let devicesId = [];
    basket.basketDevices.map((device) => devicesId.append(device.deviceId));
    const newOrder = {
      userId: userId,
      devicesId: devicesId,
      phoneNumber: phoneNumber,
      address: address,
      //createOrder
    };
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">New order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mb-1">
          <Form.Control
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.phoneNumber)}
            placeholder={"Enter telephone number"}
          />
        </Form>
        <Form>
          <Form.Control
            value={address}
            onChange={(e) => setAddress(e.target.address)}
            placeholder={"Enter address"}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Close
        </Button>
        <Button variant="outline-success" onClick={onHide}>
          Confirm order
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateOrder;
