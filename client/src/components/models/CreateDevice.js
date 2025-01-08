import React, { useContext, useState } from "react";
import { Button, Modal, Form, Dropdown, Row, Col } from "react-bootstrap";
import { Context } from "../../";

const CreateDevice = ({ show, onHide }) => {
  const { device } = useContext(Context);
  const [info, setInfo] = useState([]);

  const addInfo = () => {
    setInfo([...info, { title: "", description: "", number: Date.now() }]);
  };
  const removeInfo = (number) => {
    setInfo(info.filter(i => i.number !== number))
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add new list
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Dropdown className="mt-2">
            <Dropdown.Toggle>Chose type</Dropdown.Toggle>
            <Dropdown.Menu>
              {device.types.map((type) => (
                <Dropdown.Item key={type.id}>{type.name}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="mt-2">
            <Dropdown.Toggle>Chose brand</Dropdown.Toggle>
            <Dropdown.Menu>
              {device.brands.map((brand) => (
                <Dropdown.Item key={brand.id}>{brand.name}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Form.Control
            className="mt-3"
            placeholder="Enter name of the device"
          />
          <Form.Control className="mt-3" placeholder="Enter the description" />
          <Form.Control
            className="mt-3"
            placeholder="Enter a price of device"
            type="number"
          />
          <Form.Control
            className="mt-3"
            placeholder="Upload picture of device"
            type="file"
          />
          <hr />
          <Button variant="outline-dark" onClick={addInfo}>
            Add new property
          </Button>
          {info.map((i) => (
            <Row className="mt-2" key={i.number}>
              <Col md={4}>
                <Form.Control placeholder="Enter name of characteristic" />
              </Col>
              <Col md={4}>
                <Form.Control placeholder="Enter description" />
              </Col>
              <Col md={4}>
                <Button onClick={() => removeInfo(i.number)} variant="outline-danger">Delete</Button>
              </Col>
            </Row>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Close
        </Button>
        <Button variant="outline-success" onClick={onHide}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateDevice;
