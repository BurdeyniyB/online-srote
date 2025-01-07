import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../index";
import { Row } from "react-bootstrap";
import DeviceItem from "./DeviceItem";

const DeviceList = observer(() => {
    const {device} = useContext(Context);

    return(
        <Row className="d-flex m-3">
            {device.devices.map(device =>
               <DeviceItem key={device.id} device={device}></DeviceItem>
               )}
        </Row>
    )
})

export default DeviceList;