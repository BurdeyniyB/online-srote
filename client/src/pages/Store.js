import React, { useContext, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import DropBar from "../components/DropBar";
import DeviceList from "../components/DeviceList";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceAPI";
import Pages from "../components/Pages";
import "../style/App.css";
import PriceFilter from "../components/PriceFilter";

const Store = observer(() => {
  const { device } = useContext(Context);

  const updateLimitBasedOnWidth = () => {
    const width = window.innerWidth;
    if (width >= 780 && width <= 1400) {
      device.setlimit(9); // Великий екран
    }
  };

  useEffect(() => {
    updateLimitBasedOnWidth();
    window.addEventListener("resize", updateLimitBasedOnWidth);
    return () => window.removeEventListener("resize", updateLimitBasedOnWidth);
  }, []);

  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));
    fetchBrands().then((data) => device.setBrands(data));
    fetchDevices(
      null,
      null,
      null,
      null,
      "date_desc",
      1,
      device.limit,
      null
    ).then((data) => {
      device.setDevices(data.rows);
      device.setTotalCount(data.count);
    });
  }, []);

  useEffect(() => {
    fetchDevices(
      device.selectedType.map((t) => t.id).join(","),
      device.selectedBrand.map((b) => b.id).join(","),
      device.minPrice,
      device.maxPrice,
      device.selectedSortBy.id,
      device.page,
      device.limit,
      device.search
    ).then((data) => {
      device.setDevices(data.rows);
      device.setTotalCount(data.count);
    });
  }, [
    device.selectedType,
    device.selectedBrand,
    device.minPrice,
    device.maxPrice,
    device.selectedSortBy,
    device.page,
    device.search,
  ]);

  const handlePriceChange = ({ min, max }) => {
    device.setMinPrice(min);
    device.setMaxPrice(max);
  };

  return (
    <Container className="store-container">
      <Row>
        <Col xs={12} md={3} className="store-col d-flex justify-content-center">
          <div style={{ width: "100%", maxWidth: "300px" }}>
            <PriceFilter
              min={0}
              max={50000}
              onPriceChange={handlePriceChange}
            />
            <DropBar
              name="Sort by"
              items={device.sortBy}
              selectedItems={device.selectedSortBy}
              setSelectedItems={(items) => device.setSelectedSortBy(items)}
              checkBox={false}
            />
            <DropBar
              name="Type"
              items={device.types}
              selectedItems={device.selectedType} // 🔥 Масив
              setSelectedItems={(items) => device.setSelectedType(items)}
              checkBox={true}
            />

            <DropBar
              name="Brand"
              items={device.brands}
              selectedItems={device.selectedBrand} // 🔥 Масив
              setSelectedItems={(items) => device.setSelectedBrand(items)}
              checkBox={true}
            />
          </div>
        </Col>
        <Col xs={12} md={9} className="d-flex">
          <div style={{ width: "100%", maxWidth: "800px" }}>
            <DeviceList />
            <Pages />
          </div>
        </Col>
      </Row>
    </Container>
  );
});

export default Store;
