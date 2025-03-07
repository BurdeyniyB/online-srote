import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import DropBar from "../components/DropBar";
import DeviceList from "../components/DeviceList";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceAPI";
import Pages from "../components/Pages";
import "../style/App.css";
import PriceFilter from "../components/PriceFilter";
import { FaSearch } from "react-icons/fa";
import Filter from "../components/Filter";

const Store = observer(() => {
  const { device } = useContext(Context);
  const [searchQuery, setSearchQuery] = useState("");
  const [timer, setTimer] = useState(null);

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

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = window.setTimeout(() => {
      device.setSearch(searchQuery);
    }, 500);

    setTimer(newTimer);
  }, [searchQuery]);

  return (
    <Container fluid className="store-container">
      <div className="store-search-container">
        <FaSearch className="store-search-icon" />
        <input
          type="search"
          placeholder="Search..."
          className="store-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Row>
        <Col xs={12} md={3} className="store-col d-flex justify-content-center">
         <Filter />
        </Col>
        <Col xs={12} md={9} className="d-flex device-col">
          <div style={{ width: "100%" }}>
            <DeviceList />
            <Pages />
          </div>
        </Col>
      </Row>
    </Container>
  );
});

export default Store;
