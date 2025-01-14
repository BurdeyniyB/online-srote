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
      <Card style={{ width: 150, cursor: "pointer" }} border="light" className="mb-5">
        <Image width={150} height={180} src={process.env.REACT_APP_API_URL + device.img} />
        <div>{device.name}</div>
      </Card>
    </Col>
  );
};

export default DeviceItem;
