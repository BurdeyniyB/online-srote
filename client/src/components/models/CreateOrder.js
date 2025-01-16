import React, { useContext, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Context } from "../..";
import { createOrder } from "../../http/orderAPI";
import { destroyDeviceFromBasket } from "../../http/basketAPI";

const CreateOrder = ({ show, onHide }) => {
  const { user, basket } = useContext(Context);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const addOrder = () => {
    const userId = user.user.id;
    const devicesId = basket.basketDevices.map((device) => device.deviceId);
    const newOrder = {
      userId,
      devicesId,
      phoneNumber,
      address,
    };

    devicesId.map((id) => {
      const basketData = {
        userId: userId,
        deviceId: id,
      };
      destroyDeviceFromBasket(basketData);
      basket.removeBasketDevice(id);
    });
    createOrder(newOrder)
      .then(() => {
        onHide();
      })
      .catch((error) => {
        console.error("Failed to create order:", error);
      });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">New order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mb-1">
          <Form.Control
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder={"Enter telephone number"}
          />
        </Form>
        <Form>
          <Form.Control
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={"Enter address"}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Close
        </Button>
        <Button variant="outline-success" onClick={addOrder}>
          Confirm order
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateOrder;
