import React, { useState } from "react";
import {
  MdDashboard,
  MdStorefront,
  MdListAlt,
  MdLocalOffer,
} from "react-icons/md";
import AdminOrders from "../components/admin/AdminOrders";
import CreateBrand from "../components/models/CreateBrand";
import CreateDevice from "../components/models/CreateDevice";
import CreateType from "../components/models/CreateType";
import "../style/Admin.css";

const NAV_ITEMS = [
  { key: "dashboard",   label: "Dashboard",    Icon: MdDashboard },
  { key: "marketplace", label: "Marketplace",  Icon: MdStorefront },
  { key: "orders",      label: "Orders",       Icon: MdListAlt },
  { key: "discounts",   label: "Discounts",    Icon: MdLocalOffer },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [brandVisible, setBrandVisible] = useState(false);
  const [typeVisible,  setTypeVisible]  = useState(false);
  const [deviceVisible, setDeviceVisible] = useState(false);

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-section">Menu</div>
        {NAV_ITEMS.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`admin-nav-item${activeTab === key ? " active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </aside>

      {/* ── Main content ── */}
      <main className="admin-main">
        {activeTab === "dashboard" && (
          <div className="admin-placeholder">
            <h2>Dashboard</h2>
            <p>Analytics & stats — coming soon.</p>
          </div>
        )}

        {activeTab === "marketplace" && (
          <div className="admin-marketplace">
            <div className="admin-page-header">
              <h1 className="admin-page-title">Marketplace</h1>
            </div>
            <div className="marketplace-buttons">
              <button className="marketplace-btn" onClick={() => setBrandVisible(true)}>
                + Add Brand
              </button>
              <button className="marketplace-btn" onClick={() => setTypeVisible(true)}>
                + Add Type
              </button>
              <button className="marketplace-btn" onClick={() => setDeviceVisible(true)}>
                + Add Device
              </button>
            </div>
            <CreateBrand  show={brandVisible}  onHide={() => setBrandVisible(false)} />
            <CreateType   show={typeVisible}   onHide={() => setTypeVisible(false)} />
            <CreateDevice show={deviceVisible} onHide={() => setDeviceVisible(false)} />
          </div>
        )}

        {activeTab === "orders" && <AdminOrders />}

        {activeTab === "discounts" && (
          <div className="admin-placeholder">
            <h2>Discounts</h2>
            <p>Coupon & promo management — coming soon.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
