import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../index";
import { Row } from "react-bootstrap";
import DeviceItem from "./DeviceItem";
import "../style/App.css";

const DeviceList = observer(() => {
  const { device } = useContext(Context);

  return (
    <Row className="d-flex mt-3 device-list-container">
      {device.devices.map((device) => (
        <DeviceItem key={device.id} device={device} />
      ))}
    </Row>
  );
});

export default DeviceList;
