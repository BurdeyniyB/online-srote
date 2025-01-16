import React from "react";
import { Card, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/const";
import "../style/App.css";  // для додаткових стилів

const DeviceItem = ({ device }) => {
  const navigate = useNavigate();

  return (
    <Col
      md={3}
      className="mb-4"
      onClick={() => navigate(DEVICE_ROUTE + "/" + device.id)}
    >
      <Card className="device-card" border="light">
        <div className="image-container">
          <Image
            width={150}
            height={180}
            src={process.env.REACT_APP_API_URL + device.img}
            alt={device.name}
            className="device-image"
          />
        </div>
        <div className="device-name">{device.name}</div>
        <div className="device-price">
          {device.price} <span className="currency">грн</span>
        </div>
      </Card>
    </Col>
  );
};

export default DeviceItem;
