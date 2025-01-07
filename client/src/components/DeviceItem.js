import React from "react";
import { Card, Col, Image } from "react-bootstrap";

const DeviceItem = ({ device }) => {
  console.log(device.img);
  return (
    <Col md={3}>
      <Card style={{ width: 150, cursor: "pointer" }} border="light">
        <Image width={150} src={device.img} />
        <div>{device.name}</div>
      </Card>
    </Col>
  );
};

export default DeviceItem;
