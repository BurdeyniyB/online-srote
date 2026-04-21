import React, { useState } from "react";
import {
  MdDashboard,
  MdStorefront,
  MdListAlt,
  MdLocalOffer,
} from "react-icons/md";
import AdminOrders from "../components/admin/AdminOrders";
import AdminMarketplace from "../components/admin/AdminMarketplace";
import AdminDashboard from "../components/admin/AdminDashboard";
import "../style/Admin.css";

const NAV_ITEMS = [
  { key: "dashboard",   label: "Dashboard",    Icon: MdDashboard },
  { key: "marketplace", label: "Marketplace",  Icon: MdStorefront },
  { key: "orders",      label: "Orders",       Icon: MdListAlt },
  { key: "discounts",   label: "Discounts",    Icon: MdLocalOffer },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

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
        {activeTab === "dashboard" && <AdminDashboard />}

        {activeTab === "marketplace" && <AdminMarketplace />}

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
