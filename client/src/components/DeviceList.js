import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../index";
import { Row, Col } from "react-bootstrap";
import DeviceItem from "./DeviceItem";
import "../style/App.css";

const DeviceList = observer(() => {
  const { device } = useContext(Context);

  return (
    <Row className="mt-3 device-list-container">
      {device.devices.map((device) => (
        <Col
          key={device.id}
          className="mb-4"
        >
          <DeviceItem device={device} />
        </Col>
      ))}
    </Row>
  );
});

export default DeviceList;
