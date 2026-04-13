import React, { useState, useEffect, useCallback } from "react";
import {
  MdSearch, MdFilterList, MdFileDownload,
  MdVisibility, MdContentCopy, MdDelete, MdRefresh,
} from "react-icons/md";
import { fetchOrders, removeOrder } from "../../http/orderAPI";
import OrderDetailDrawer from "./OrderDetailDrawer";

// ── Helpers ────────────────────────────────────────────────
const fmt = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const calcTotal = (order) => {
  if (order.total != null) return order.total;
  return (order.order_devices || []).reduce((sum, od) => {
    const price = od.device?.price || 0;
    const qty   = od.quantity || 1;
    const sale  = od.device?.sale || 0;
    return sum + price * qty * (1 - sale / 100);
  }, 0);
};

const exportCSV = (orders) => {
  const headers = [
    "Order #", "Date", "First Name", "Last Name", "Email", "Phone",
    "Total", "Payment", "Delivery", "Status", "Payment Status", "Delivery Status",
  ];
  const rows = orders.map((o) => [
    o.id,
    fmt(o.createdAt),
    o.first_name || "",
    o.last_name  || "",
    o.email,
    o.phone_number,
    calcTotal(o).toFixed(2),
    o.payment,
    o.delivery_method,
    o.status,
    o.payment_status,
    o.delivery_status,
  ]);
  const csv = [headers, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `orders-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ── Badge helpers ──────────────────────────────────────────
const orderBadge = (s) => {
  const map = { new: "status-new", processing: "status-processing", shipped: "status-shipped", delivered: "status-delivered", cancelled: "status-cancelled" };
  return <span className={`status-badge ${map[s] || "status-new"}`}>{s || "new"}</span>;
};
const payBadge = (s) => {
  const map = { paid: "pay-paid", unpaid: "pay-unpaid", refunded: "pay-refunded" };
  return <span className={`status-badge ${map[s] || "pay-unpaid"}`}>{s || "unpaid"}</span>;
};
const delBadge = (s) => {
  const map = { pending: "del-pending", shipped: "del-shipped", delivered: "del-delivered", returned: "del-returned" };
  return <span className={`status-badge ${map[s] || "del-pending"}`}>{s || "pending"}</span>;
};

const STATUSES       = ["", "new", "processing", "shipped", "delivered", "cancelled"];
const PAY_STATUSES   = ["", "unpaid", "paid", "refunded"];
const DEL_STATUSES   = ["", "pending", "shipped", "delivered", "returned"];
const PAY_METHODS    = ["", "card", "paypal", "paypal_credit", "cash"];
const LIMITS         = [10, 20, 50, 100];

// ── Component ─────────────────────────────────────────────
const AdminOrders = () => {
  const [orders,   setOrders]   = useState([]);
  const [total,    setTotal]    = useState(0);
  const [pages,    setPages]    = useState(1);
  const [page,     setPage]     = useState(1);
  const [limit,    setLimit]    = useState(20);
  const [loading,  setLoading]  = useState(false);

  const [selected, setSelected] = useState(null);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    payment_status: "",
    delivery_status: "",
    payment: "",
    date_from: "",
    date_to: "",
    amount_min: "",
    amount_max: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchOrders(page, limit, filters);
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => { load(); }, [load]);

  const handleFilterChange = (key, val) => {
    setFilters((f) => ({ ...f, [key]: val }));
    setPage(1);
  };

  const handleDelete = async (e, orderId) => {
    e.stopPropagation();
    if (!window.confirm(`Delete order #${orderId}?`)) return;
    await removeOrder(orderId);
    load();
  };

  const copyId = (e, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(String(id));
  };

  const handleOrderUpdated = (updated) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    setSelected(updated);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="admin-orders">
      {/* ── Page header ── */}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
        <div className="admin-header-actions">
          <button className="btn-export" onClick={load} title="Refresh">
            <MdRefresh /> Refresh
          </button>
          <button className="btn-export" onClick={() => exportCSV(orders)} title="Export CSV">
            <MdFileDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Search + filter toggle ── */}
      <div className="orders-filters-bar">
        <div className="filter-search-wrap">
          <MdSearch />
          <input
            className="filter-search-input"
            placeholder="Search by order #, name, email, phone…"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label">Order status</span>
          <select className="filter-select" value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s || "All statuses"}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Payment</span>
          <select className="filter-select" value={filters.payment_status} onChange={(e) => handleFilterChange("payment_status", e.target.value)}>
            {PAY_STATUSES.map((s) => <option key={s} value={s}>{s || "All"}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Delivery</span>
          <select className="filter-select" value={filters.delivery_status} onChange={(e) => handleFilterChange("delivery_status", e.target.value)}>
            {DEL_STATUSES.map((s) => <option key={s} value={s}>{s || "All"}</option>)}
          </select>
        </div>

        <button
          className={`filter-toggle-btn${showFilters ? " active" : ""}`}
          onClick={() => setShowFilters((v) => !v)}
        >
          <MdFilterList />
          More filters
          {activeFilterCount > 0 && <span style={{ marginLeft: 4, background: "#ffa500", color: "#fff", borderRadius: "10px", padding: "0 6px", fontSize: 11 }}>{activeFilterCount}</span>}
        </button>
      </div>

      {/* ── Expanded filters ── */}
      {showFilters && (
        <div className="filters-expanded">
          <div className="filter-group">
            <span className="filter-label">Payment method</span>
            <select className="filter-select" value={filters.payment} onChange={(e) => handleFilterChange("payment", e.target.value)}>
              {PAY_METHODS.map((s) => <option key={s} value={s}>{s || "All methods"}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <span className="filter-label">Date from</span>
            <input type="date" className="filter-date-input" value={filters.date_from} onChange={(e) => handleFilterChange("date_from", e.target.value)} />
          </div>
          <div className="filter-group">
            <span className="filter-label">Date to</span>
            <input type="date" className="filter-date-input" value={filters.date_to} onChange={(e) => handleFilterChange("date_to", e.target.value)} />
          </div>
          <div className="filter-group">
            <span className="filter-label">Amount min ($)</span>
            <input type="number" className="filter-date-input" style={{ width: 100 }} value={filters.amount_min} onChange={(e) => handleFilterChange("amount_min", e.target.value)} />
          </div>
          <div className="filter-group">
            <span className="filter-label">Amount max ($)</span>
            <input type="number" className="filter-date-input" style={{ width: 100 }} value={filters.amount_max} onChange={(e) => handleFilterChange("amount_max", e.target.value)} />
          </div>
          <button className="filter-toggle-btn" onClick={() => { setFilters({ search: "", status: "", payment_status: "", delivery_status: "", payment: "", date_from: "", date_to: "", amount_min: "", amount_max: "" }); setPage(1); }}>
            Clear all
          </button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="orders-table-wrapper">
        {loading ? (
          <div className="orders-loading"><MdRefresh /> Loading…</div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">No orders found.</div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Delivery</th>
                <th>Pay status</th>
                <th>Order status</th>
                <th>Delivery status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="clickable-row" onClick={() => setSelected(o)}>
                  <td className="order-id-cell">#{o.id}</td>
                  <td className="order-date-cell">{fmt(o.createdAt)}</td>
                  <td className="order-customer-cell">
                    <div className="customer-name">
                      {o.first_name || o.last_name
                        ? `${o.first_name || ""} ${o.last_name || ""}`.trim()
                        : "—"}
                    </div>
                    <div className="customer-sub">{o.email}</div>
                    <div className="customer-sub">{o.phone_number}</div>
                  </td>
                  <td>{(o.order_devices || []).length}</td>
                  <td className="order-amount-cell">${calcTotal(o).toFixed(2)}</td>
                  <td style={{ textTransform: "capitalize" }}>{o.payment}</td>
                  <td style={{ textTransform: "capitalize" }}>{o.delivery_method || "standard"}</td>
                  <td>{payBadge(o.payment_status)}</td>
                  <td>{orderBadge(o.status)}</td>
                  <td>{delBadge(o.delivery_status)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="order-actions">
                      <button className="action-btn" title="View" onClick={() => setSelected(o)}><MdVisibility /></button>
                      <button className="action-btn" title="Copy #" onClick={(e) => copyId(e, o.id)}><MdContentCopy /></button>
                      <button className="action-btn danger" title="Delete" onClick={(e) => handleDelete(e, o.id)}><MdDelete /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ── Pagination ── */}
        {!loading && orders.length > 0 && (
          <div className="orders-pagination">
            <span>
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} orders
              &nbsp;|&nbsp;
              <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} style={{ border: "1px solid #ddd", borderRadius: 5, padding: "2px 6px", fontSize: 13 }}>
                {LIMITS.map((l) => <option key={l} value={l}>{l} per page</option>)}
              </select>
            </span>
            <div className="pagination-buttons">
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
              <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹</button>
              {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, pages - 4)) + i;
                return (
                  <button key={p} className={`page-btn${p === page ? " active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                );
              })}
              <button className="page-btn" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>›</button>
              <button className="page-btn" disabled={page === pages} onClick={() => setPage(pages)}>»</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Order detail drawer ── */}
      {selected && (
        <OrderDetailDrawer
          order={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleOrderUpdated}
        />
      )}
    </div>
  );
};

export default AdminOrders;
