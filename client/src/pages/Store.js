import React, { useContext, useEffect, useRef, useState } from "react";
import DeviceList from "../components/DeviceList";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceAPI";
import Pages from "../components/Pages";
import "../style/App.css";
import { FaSearch } from "react-icons/fa";
import Filter from "../components/Filter";
import AiChat from "../components/AiChat";

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

  useEffect(() => {
    if (timer) clearTimeout(timer);
    const newTimer = window.setTimeout(() => device.setSearch(searchQuery), 500);
    setTimer(newTimer);
  }, [searchQuery]);

  const hasActiveFilters =
    device.selectedType.length > 0 ||
    device.selectedBrand.length > 0 ||
    device.inStockOnly ||
    device.onSaleOnly ||
    device.minRating;

  return (
    <div className="store-page">
      <div className="store-body">
        <aside className="store-filter-col">
          <Filter />
        </aside>
        <main className="store-main-col">

          {/* Search */}
          <div className="store-search-card">
            <FaSearch className="store-search-card-icon" />
            <input
              type="search"
              placeholder="Search products…"
              className="store-search-card-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Active filter chips */}
          <div className="store-results-bar">
            {hasActiveFilters && (
              <div className="store-chips">
                {device.selectedType.map((t) => (
                  <span key={t.id} className="store-chip">
                    {t.name}
                    <button onClick={() => device.setSelectedType(t)}>×</button>
                  </span>
                ))}
                {device.selectedBrand.map((b) => (
                  <span key={b.id} className="store-chip">
                    {b.name}
                    <button onClick={() => device.setSelectedBrand(b)}>×</button>
                  </span>
                ))}
                {device.minRating && (
                  <span className="store-chip">
                    {device.minRating}★+
                    <button onClick={() => device.setMinRating(null)}>×</button>
                  </span>
                )}
                {device.inStockOnly && (
                  <span className="store-chip">
                    In Stock
                    <button onClick={() => device.setInStockOnly(false)}>×</button>
                  </span>
                )}
                {device.onSaleOnly && (
                  <span className="store-chip">
                    On Sale
                    <button onClick={() => device.setOnSaleOnly(false)}>×</button>
                  </span>
                )}
                <button className="store-chips-clear" onClick={() => device.clearFilters()}>
                  Clear all
                </button>
              </div>
            )}
          </div>

          <DeviceList />
          <div className="store-results-footer">
            <span className="store-results-count">
              {device.totalCount.toLocaleString()} products
            </span>
          </div>
          <Pages onLoadMore={() => { appendNextFetch.current = true; }} />
        </main>
      </div>
      <AiChat />
    </div>
  );
});

export default Store;
