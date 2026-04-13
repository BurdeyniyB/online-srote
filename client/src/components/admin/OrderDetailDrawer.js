import React, { useState, useEffect } from "react";
import {
  MdClose, MdCheckCircle, MdPayment, MdLocalShipping,
  MdCancel, MdUndo, MdDone,
} from "react-icons/md";
import {
  updateOrderStatus,
  updateOrderTracking,
  updateOrderNotes,
} from "../../http/orderAPI";

// ── Helpers ────────────────────────────────────────────────
const fmt = (dateStr) =>
  new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const calcTotal = (order) => {
  if (order.total != null) return order.total;
  return (order.order_devices || []).reduce((sum, od) => {
    const price = od.device?.price || 0;
    const qty   = od.quantity || 1;
    const sale  = od.device?.sale || 0;
    return sum + price * qty * (1 - sale / 100);
  }, 0);
};

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

// ── Component ─────────────────────────────────────────────
const OrderDetailDrawer = ({ order: initialOrder, onClose, onUpdated }) => {
  const [order,   setOrder]   = useState(initialOrder);
  const [saving,  setSaving]  = useState(false);
  const [tracking, setTracking] = useState(initialOrder.tracking_number || "");
  const [notes,   setNotes]   = useState(initialOrder.manager_notes || "");

  useEffect(() => {
    setOrder(initialOrder);
    setTracking(initialOrder.tracking_number || "");
    setNotes(initialOrder.manager_notes || "");
  }, [initialOrder]);

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const applyStatus = async (updates) => {
    setSaving(true);
    try {
      const res = await updateOrderStatus(order.id, updates);
      const updated = { ...order, ...res.order };
      setOrder(updated);
      onUpdated && onUpdated(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const saveTracking = async () => {
    setSaving(true);
    try {
      await updateOrderTracking(order.id, tracking);
      const updated = { ...order, tracking_number: tracking };
      setOrder(updated);
      onUpdated && onUpdated(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      await updateOrderNotes(order.id, notes);
      const updated = { ...order, manager_notes: notes };
      setOrder(updated);
      onUpdated && onUpdated(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const subtotal = (order.order_devices || []).reduce((s, od) => s + (od.device?.price || 0) * (od.quantity || 1), 0);
  const discount = (order.order_devices || []).reduce((s, od) => {
    const sale = od.device?.sale || 0;
    return s + (od.device?.price || 0) * (od.quantity || 1) * (sale / 100);
  }, 0);
  const shipping = 0; // extend later
  const total = calcTotal(order);

  return (
    <div className="order-detail-overlay" onClick={onClose}>
      <div className="order-detail-drawer" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">Order #{order.id}</h2>
            <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
              {fmt(order.createdAt)}
            </div>
          </div>
          <button className="drawer-close" onClick={onClose}><MdClose /></button>
        </div>

        <div className="drawer-body">

          {/* ── Current statuses + quick changes ── */}
          <div className="drawer-section">
            <div className="drawer-section-title">Statuses</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {orderBadge(order.status)}
              {payBadge(order.payment_status)}
              {delBadge(order.delivery_status)}
            </div>

            <div className="status-selects-row">
              <div className="status-select-group">
                <label>Order status</label>
                <select
                  value={order.status || "new"}
                  onChange={(e) => applyStatus({ status: e.target.value })}
                  disabled={saving}
                >
                  {["new","processing","shipped","delivered","cancelled"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="status-select-group">
                <label>Payment status</label>
                <select
                  value={order.payment_status || "unpaid"}
                  onChange={(e) => applyStatus({ payment_status: e.target.value })}
                  disabled={saving}
                >
                  {["unpaid","paid","refunded"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="status-select-group">
                <label>Delivery status</label>
                <select
                  value={order.delivery_status || "pending"}
                  onChange={(e) => applyStatus({ delivery_status: e.target.value })}
                  disabled={saving}
                >
                  {["pending","shipped","delivered","returned"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="drawer-actions">
              <button className="btn-action confirm" onClick={() => applyStatus({ status: "processing" })} disabled={saving}>
                <MdCheckCircle /> Confirm
              </button>
              <button className="btn-action pay" onClick={() => applyStatus({ payment_status: "paid" })} disabled={saving}>
                <MdPayment /> Mark Paid
              </button>
              <button className="btn-action ship" onClick={() => applyStatus({ status: "shipped", delivery_status: "shipped" })} disabled={saving}>
                <MdLocalShipping /> Ship
              </button>
              <button className="btn-action deliver" onClick={() => applyStatus({ status: "delivered", delivery_status: "delivered" })} disabled={saving}>
                <MdDone /> Delivered
              </button>
              <button className="btn-action refund" onClick={() => applyStatus({ payment_status: "refunded" })} disabled={saving}>
                <MdUndo /> Refund
              </button>
              <button className="btn-action cancel" onClick={() => applyStatus({ status: "cancelled" })} disabled={saving}>
                <MdCancel /> Cancel
              </button>
            </div>
          </div>

          {/* ── Customer info ── */}
          <div className="drawer-section">
            <div className="drawer-section-title">Customer</div>
            <div className="drawer-info-grid">
              <div className="drawer-info-item">
                <label>Full name</label>
                <span>
                  {order.first_name || order.last_name
                    ? `${order.first_name || ""} ${order.last_name || ""}`.trim()
                    : "—"}
                </span>
              </div>
              <div className="drawer-info-item">
                <label>Email</label>
                <span>{order.email}</span>
              </div>
              <div className="drawer-info-item">
                <label>Phone</label>
                <span>{order.phone_number}</span>
              </div>
              <div className="drawer-info-item">
                <label>Payment method</label>
                <span style={{ textTransform: "capitalize" }}>{order.payment}</span>
              </div>
            </div>
          </div>

          {/* ── Shipping address ── */}
          <div className="drawer-section">
            <div className="drawer-section-title">Shipping Address</div>
            <div className="drawer-info-grid">
              {order.address_line && (
                <div className="drawer-info-item" style={{ gridColumn: "1 / -1" }}>
                  <label>Address</label>
                  <span>{order.address_line}</span>
                </div>
              )}
              <div className="drawer-info-item">
                <label>Country</label>
                <span>{order.country}</span>
              </div>
              <div className="drawer-info-item">
                <label>State / Province</label>
                <span>{order.state_province}</span>
              </div>
              <div className="drawer-info-item">
                <label>ZIP / Postal code</label>
                <span>{order.zip_postal_code}</span>
              </div>
              <div className="drawer-info-item">
                <label>Delivery method</label>
                <span style={{ textTransform: "capitalize" }}>{order.delivery_method || "standard"}</span>
              </div>
            </div>
          </div>

          {/* ── Products ── */}
          <div className="drawer-section">
            <div className="drawer-section-title">Products</div>
            <table className="drawer-products-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Disc.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(order.order_devices || []).map((od) => {
                  const price = od.device?.price || 0;
                  const sale  = od.device?.sale  || 0;
                  const qty   = od.quantity || 1;
                  const sub   = price * qty * (1 - sale / 100);
                  const name  = od.device?.name ? od.device.name.split(",")[0] : `Device #${od.deviceId}`;
                  const img   = od.device?.img
                    ? (Array.isArray(od.device.img) ? od.device.img[0] : od.device.img)
                    : null;
                  return (
                    <tr key={od.id}>
                      <td>
                        {img && <img src={img} alt={name} className="product-img-thumb" />}
                      </td>
                      <td style={{ maxWidth: 180, wordBreak: "break-word" }}>{name}</td>
                      <td>{qty}</td>
                      <td>${price.toFixed(2)}</td>
                      <td>{sale > 0 ? `${sale}%` : "—"}</td>
                      <td><strong>${sub.toFixed(2)}</strong></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Summary */}
            <div className="order-summary-rows" style={{ marginTop: 12 }}>
              <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              {discount > 0 && <div className="summary-row"><span>Discount</span><span>−${discount.toFixed(2)}</span></div>}
              <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
              <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>

          {/* ── Customer comment ── */}
          {order.customer_comment && (
            <div className="drawer-section">
              <div className="drawer-section-title">Customer Comment</div>
              <p style={{ fontSize: 14, color: "#444", background: "#f8f9fa", borderRadius: 8, padding: "10px 14px", margin: 0 }}>
                {order.customer_comment}
              </p>
            </div>
          )}

          {/* ── Tracking number ── */}
          <div className="drawer-section">
            <div className="drawer-section-title">Tracking Number</div>
            <div className="drawer-input-row">
              <input
                className="drawer-input"
                placeholder="Enter tracking / TTN number…"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
              />
              <button className="btn-save" onClick={saveTracking} disabled={saving}>Save</button>
            </div>
          </div>

          {/* ── Manager notes ── */}
          <div className="drawer-section">
            <div className="drawer-section-title">Manager Notes (internal)</div>
            <textarea
              className="drawer-textarea"
              placeholder="Internal notes visible only to managers…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button className="btn-save" style={{ marginTop: 8 }} onClick={saveNotes} disabled={saving}>Save Notes</button>
          </div>

          {/* ── Status history ── */}
          {(order.status_history || []).length > 0 && (
            <div className="drawer-section">
              <div className="drawer-section-title">Status History</div>
              <div className="history-log">
                {[...(order.status_history || [])].reverse().map((entry, i) => (
                  <div key={i} className="history-item">
                    <div className="history-dot" />
                    <div>
                      <div className="history-time">{fmt(entry.timestamp)} · {entry.changed_by}</div>
                      <div className="history-changes">
                        {Object.entries(entry.changes || {}).map(([field, { from, to }]) => (
                          <span key={field} style={{ marginRight: 10 }}>
                            <strong>{field}:</strong> {from || "—"} → {to}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OrderDetailDrawer;
