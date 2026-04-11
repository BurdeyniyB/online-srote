import React, { useContext, useEffect, useRef, useState } from "react";
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
  const appendNextFetch = useRef(false);

  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));
    fetchBrands().then((data) => device.setBrands(data));
  }, [device]);

  useEffect(() => {
    if (!device.limit) return;
    fetchDevices(
      device.selectedType.map((t) => t.id).join(","),
      device.selectedBrand.map((b) => b.id).join(","),
      device.minPrice,
      device.maxPrice,
      device.selectedSortBy.id,
      device.page,
      device.limit,
      device.search,
      device.minRating,
      device.inStockOnly || undefined,
      device.onSaleOnly || undefined,
    ).then((data) => {
      if (appendNextFetch.current) {
        device.appendDevices(data.rows);
        appendNextFetch.current = false;
      } else {
        device.setDevices(data.rows);
      }
      device.setTotalCount(data.count);
    });
  }, [
    device,
    device.selectedType,
    device.selectedBrand,
    device.minPrice,
    device.maxPrice,
    device.selectedSortBy,
    device.page,
    device.search,
    device.limit,
    device.minRating,
    device.inStockOnly,
    device.onSaleOnly,
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
          <div className="device-scroll-wrapper">
            <DeviceList />
          </div>
        </Col>
      </Row>
      <Pages onLoadMore={() => { appendNextFetch.current = true; }} />
    </Container>
  );
});

export default Store;
