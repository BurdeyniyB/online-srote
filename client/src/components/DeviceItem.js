import React from "react";
import { Card, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/const";

const DeviceItem = ({ device }) => {
  const navigate = useNavigate();

  return (
    <Col
      md={3}
      style={{ width: "auto" }}
      onClick={() => navigate(DEVICE_ROUTE + "/" + device.id)}
    >
      <Card style={{ width: 150, cursor: "pointer" }} border="light">
        <Image width={150} src={device.img} />
        <div>{device.name}</div>
      </Card>
    </Col>
  );
};

export default DeviceItem;
