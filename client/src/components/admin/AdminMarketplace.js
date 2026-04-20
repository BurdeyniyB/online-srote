import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaEdit, FaTrash, FaPlus, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { fetchDevices, fetchBrands, fetchTypes, deleteDevice } from "../../http/deviceAPI";
import CreateDevice from "../models/CreateDevice";
import EditDevice from "../models/EditDevice";
import CreateBrand from "../models/CreateBrand";
import CreateType from "../models/CreateType";

const LIMIT = 20;

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="star-filled" style={{ fontSize: 11 }} />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="star-filled" style={{ fontSize: 11 }} />);
    else stars.push(<FaRegStar key={i} className="star-empty" style={{ fontSize: 11 }} />);
  }
  return stars;
};

const AdminMarketplace = () => {
  const [devices, setDevices] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [filterBrand, setFilterBrand] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [page, setPage] = useState(1);

  const [createDeviceVisible, setCreateDeviceVisible] = useState(false);
  const [editDevice, setEditDevice] = useState(null);
  const [brandVisible, setBrandVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    fetchBrands().then(setBrands);
    fetchTypes().then(setTypes);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
  }, [searchInput]);

  const loadDevices = useCallback(() => {
    setLoading(true);
    fetchDevices(
      filterType || undefined,
      filterBrand || undefined,
      undefined,
      undefined,
      undefined,
      page,
      LIMIT,
      search || undefined,
      undefined,
      filterStock === "instock" ? true : undefined,
      undefined,
      filterStock === "outofstock" ? true : undefined,
    )
      .then((data) => {
        setDevices(data.rows);
        setTotalCount(data.count);
      })
      .finally(() => setLoading(false));
  }, [filterType, filterBrand, filterStock, page, search]);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this device?")) return;
    await deleteDevice(id);
    loadDevices();
  };

  const totalPages = Math.ceil(totalCount / LIMIT);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const delta = 2;
    const left = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);
    if (left > 1) pages.push(1);
    if (left > 2) pages.push("...");
    for (let p = left; p <= right; p++) pages.push(p);
    if (right < totalPages - 1) pages.push("...");
    if (right < totalPages) pages.push(totalPages);

    return (
      <div className="orders-pagination" style={{ background: "none", paddingLeft: 0, marginTop: 16 }}>
        <span style={{ fontSize: 13, color: "#888" }}>{totalCount} products</span>
        <div className="pagination-buttons">
          <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ‹
          </button>
          {pages.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} style={{ padding: "0 6px", alignSelf: "center", color: "#aaa" }}>…</span>
            ) : (
              <button
                key={p}
                className={`page-btn${p === page ? " active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            )
          )}
          <button className="page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            ›
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-marketplace">
      {/* Header */}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Marketplace</h1>
        <div className="admin-header-actions">
          <button className="marketplace-action-btn" onClick={() => setBrandVisible(true)}>
            + Brand
          </button>
          <button className="marketplace-action-btn" onClick={() => setTypeVisible(true)}>
            + Type
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="orders-filters-bar">
        <div className="filter-search-wrap" style={{ flex: 2 }}>
          <FaSearch />
          <input
            type="search"
            className="filter-search-input"
            placeholder="Search by name or ID…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <select className="filter-select" value={filterType} onChange={handleFilterChange(setFilterType)}>
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <select className="filter-select" value={filterBrand} onChange={handleFilterChange(setFilterBrand)}>
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select className="filter-select" value={filterStock} onChange={handleFilterChange(setFilterStock)}>
          <option value="">All Stock</option>
          <option value="instock">In Stock</option>
          <option value="outofstock">Out of Stock</option>
        </select>
      </div>

      {/* Count */}
      <div className="marketplace-results-count">{totalCount} products</div>

      {/* Grid */}
      {loading ? (
        <div className="orders-loading">Loading…</div>
      ) : (
        <div className="admin-device-grid">
          {/* Add card */}
          <div
            className="admin-device-card admin-device-card--add"
            onClick={() => setCreateDeviceVisible(true)}
          >
            <FaPlus className="admin-add-icon" />
            <span>Add Device</span>
          </div>

          {devices.map((device) => {
            const commaIdx = device.name.indexOf(",");
            const title = commaIdx !== -1 ? device.name.slice(0, commaIdx) : device.name;
            const subtitle = commaIdx !== -1 ? device.name.slice(commaIdx + 1).trim() : "";
            const discountedPrice =
              device.sale > 0 ? (device.price * (1 - device.sale / 100)).toFixed(2) : null;

            return (
              <div
                key={device.id}
                className={`admin-device-card${!device.inStock ? " admin-device-card--oos" : ""}`}
              >
                <div className="admin-card-id">#{device.id}</div>

                <div className="admin-card-img-wrap">
                  <img
                    src={Array.isArray(device.img) ? device.img[0] : device.img}
                    alt={device.name}
                    className="admin-card-img"
                  />
                </div>

                <div className="admin-card-name">
                  <span className="admin-card-title">
                    {title.length > 38 ? title.slice(0, 38) + "…" : title}
                  </span>
                  {subtitle && (
                    <span className="admin-card-subtitle">
                      {subtitle.length > 50 ? subtitle.slice(0, 50) + "…" : subtitle}
                    </span>
                  )}
                </div>

                <div className="admin-card-meta">
                  <div className="admin-card-rating">
                    {device.rating != null ? (
                      <>
                        {renderStars(device.rating)}
                        <span style={{ marginLeft: 3 }}>{device.rating.toFixed(1)}</span>
                      </>
                    ) : (
                      <span style={{ color: "#bbb", fontSize: 11 }}>No rating</span>
                    )}
                  </div>
                  <span
                    className={`device-stock ${device.inStock ? "device-stock--in" : "device-stock--out"}`}
                    style={{ fontSize: 11 }}
                  >
                    {device.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <div className="admin-card-price">
                  {discountedPrice ? (
                    <>
                      <span className="admin-price-current">${discountedPrice}</span>
                      <span className="admin-price-old">${device.price}</span>
                    </>
                  ) : (
                    <span className="admin-price-current">${device.price}</span>
                  )}
                  {device.sale > 0 && (
                    <span className="admin-price-sale-badge">−{device.sale}%</span>
                  )}
                </div>

                <div className="admin-card-actions">
                  <button
                    className="action-btn"
                    title="Edit"
                    onClick={() => setEditDevice(device)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="action-btn danger"
                    title="Delete"
                    onClick={() => handleDelete(device.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {renderPagination()}

      {/* Modals */}
      <CreateDevice
        show={createDeviceVisible}
        onHide={() => {
          setCreateDeviceVisible(false);
          loadDevices();
        }}
      />
      {editDevice && (
        <EditDevice
          device={editDevice}
          onHide={() => {
            setEditDevice(null);
            loadDevices();
          }}
        />
      )}
      <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
      <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
    </div>
  );
};

export default AdminMarketplace;
