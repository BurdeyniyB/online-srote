import React, { useContext, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import DropBar from "../components/DropBar";
import DeviceList from "../components/DeviceList";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceAPI";
import Pages from "../components/Pages";
import "../style/App.css";

const Store = observer(() => {
  const { device } = useContext(Context);

  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));
    fetchBrands().then((data) => device.setBrands(data));
    fetchDevices(null, null, 1, 2, null).then((data) => {
      device.setDevices(data.rows);
      device.setTotalCount(data.count);
    });
  }, []);

  useEffect(() => {
    console.log('useEffect' + '\nselected type: ' + device.selectedType.id + '\nselected brand: ' + device.selectedBrand.id);
    fetchDevices(
      device.selectedType?.id,
      device.selectedBrand?.id,
      device.page,
      device.limit,
      device.search
    ).then((data) => {
      device.setDevices(data.rows);
      device.setTotalCount(data.count);
    });
  }, [device.selectedType, device.selectedBrand, device.page, device.search]);

  return (
    <Container className="store-container">
      <Row>
        <Col md={3} className="store-col">
          <DropBar
            name="Type"
            items={device.types}
            selectedItem={device.selectedType}
            setSelectedItem={(item) => device.setSelectedType(item)}
          />
          <DropBar
            name="Brand"
            items={device.brands}
            selectedItem={device.selectedBrand}
            setSelectedItem={(item) => device.setSelectedBrand(item)}
          />
        </Col>
        <Col md={9}>
          <DeviceList />
          <Pages />
        </Col>
      </Row>
    </Container>
  );
});

export default Store;
