import { useState, useRef, useContext, Fragment, useEffect } from "react";
import { Container } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaTruck, FaCreditCard } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { Context } from "..";
import { createPaymentIntent, createPayPalOrder, capturePayPalOrder, stripeRefund, paypalRefund } from "../http/paymentAPI";
import { createOrder } from "../http/orderAPI";
import { fetchAddresses, createAddress, updateAddress, deleteAddress } from "../http/addressAPI";
import { ORDER_RESULT_ROUTE } from "../utils/const";
import "../style/Checkout.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const STRIPE_STYLE = {
  base: {
    fontSize: "14px",
    color: "#333",
    "::placeholder": { color: "#bbb" },
  },
};

const SHIPPING_METHODS = [
  { id: "free",     label: "Free",     desc: "Regulary shipment",                            priority: "standard"  },
  { id: "express",  label: "$8.50",    desc: "Get your delivery as soon as possible",         priority: "priority"  },
  { id: "schedule", label: "Schedule", desc: "Pick a date when you want to get your delivery", priority: "scheduled" },
];

function addBusinessDays(date, days) {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return result;
}

function toDateInputValue(date) {
  return date.toISOString().split("T")[0];
}

function formatShortDate(date) {
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

const STEP_META = [
  { num: 1, label: "Address", Icon: FaMapMarkerAlt },
  { num: 2, label: "Shipping", Icon: FaTruck },
  { num: 3, label: "Payment", Icon: FaCreditCard },
];

const EMPTY_FORM = {
  label: "",
  type: "HOME",
  full_name: "",
  address_line: "",
  city: "",
  state_province: "",
  zip_postal_code: "",
  country: "",
  phone_number: "",
};

// ── Address Modal ─────────────────────────────────────────────────────────────
const AddressModal = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="addr-modal-overlay" onClick={onClose}>
      <div className="addr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="addr-modal-header">
          <h6 className="addr-modal-title">{initial ? "Edit Address" : "New Address"}</h6>
          <button className="addr-modal-close" onClick={onClose}>&#10005;</button>
        </div>

        <form onSubmit={handleSubmit} className="addr-modal-body">
          <div className="addr-modal-row">
            <div className="addr-modal-field">
              <label>Label</label>
              <input className="checkout-input" placeholder="e.g. Home" value={form.label} onChange={set("label")} required />
            </div>
            <div className="addr-modal-field addr-modal-field--sm">
              <label>Type</label>
              <select className="checkout-input" value={form.type} onChange={set("type")}>
                <option value="HOME">HOME</option>
                <option value="OFFICE">OFFICE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>

          <div className="addr-modal-field">
            <label>Full Name</label>
            <input className="checkout-input" placeholder="John Doe" value={form.full_name} onChange={set("full_name")} required />
          </div>

          <div className="addr-modal-field">
            <label>Address Line</label>
            <input className="checkout-input" placeholder="Street, building, apartment" value={form.address_line} onChange={set("address_line")} required />
          </div>

          <div className="addr-modal-row">
            <div className="addr-modal-field">
              <label>City</label>
              <input className="checkout-input" placeholder="City" value={form.city} onChange={set("city")} />
            </div>
            <div className="addr-modal-field">
              <label>State / Province</label>
              <input className="checkout-input" placeholder="State" value={form.state_province} onChange={set("state_province")} />
            </div>
          </div>

          <div className="addr-modal-row">
            <div className="addr-modal-field">
              <label>ZIP / Postal Code</label>
              <input className="checkout-input" placeholder="12345" value={form.zip_postal_code} onChange={set("zip_postal_code")} />
            </div>
            <div className="addr-modal-field">
              <label>Country</label>
              <input className="checkout-input" placeholder="Country" value={form.country} onChange={set("country")} required />
            </div>
          </div>

          <div className="addr-modal-field">
            <label>Phone Number</label>
            <input className="checkout-input" placeholder="+1 (555) 000-0000" value={form.phone_number} onChange={set("phone_number")} required />
          </div>

          <div className="addr-modal-footer">
            <button type="button" className="checkout-btn-back" onClick={onClose}>Cancel</button>
            <button type="submit" className="checkout-btn-next" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Credit Card form (must be inside <Elements>) ──────────────────────────────
const CreditCardSection = ({ total, basketItems, userId, selectedAddressData, deliveryDate, deliveryPriority, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { order, basket } = useContext(Context);
  const [cardholderName, setCardholderName] = useState("");
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const { clientSecret } = await createPaymentIntent(Math.round(total * 100));
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: { name: cardholderName },
        },
      });
      if (error) {
        setErrorMsg(error.message);
        return;
      }
      if (paymentIntent?.status === "succeeded") {
        const piId = paymentIntent.id;
        const { phone, email, country, stateProvince, zipPostalCode, firstName, lastName, addressLine } = order.contactInfo;
        const addr = selectedAddressData || {};
        console.log("[Checkout] contactInfo (basket form):", { firstName, lastName, email, phone });
        console.log("[Checkout] selectedAddress full_name:", addr.full_name);
        const orderPayload = {
          userId,
          devices: basketItems.map((d) => ({ deviceId: d.id, quantity: d.quantity })),
          payment: "credit_card",
          phoneNumber: addr.phone_number || phone,
          email,
          firstName: firstName || addr.full_name?.split(" ")[0] || "",
          lastName: lastName || addr.full_name?.split(" ").slice(1).join(" ") || "",
          country: addr.country || country,
          stateProvince: addr.state_province || stateProvince,
          zipPostalCode: addr.zip_postal_code || zipPostalCode,
          addressLine: addr.address_line || addressLine,
          deliveryDate,
          deliveryPriority,
          paymentStatus: "paid",
        };
        console.log("[Checkout] orderPayload →", { firstName: orderPayload.firstName, lastName: orderPayload.lastName, email: orderPayload.email });
        try {
          const { order: created } = await createOrder(orderPayload);
          basket.clearBasket();
          navigate(ORDER_RESULT_ROUTE, {
            state: {
              success: true,
              orderId: created.order_number || created.id,
              total,
              payment: "credit_card",
              items: basketItems.map(({ id, name, price, img, quantity }) => ({
                id, name, price, quantity,
                img: Array.isArray(img) ? img[0] : img,
              })),
            },
          });
        } catch (orderErr) {
          console.error("[Checkout] order catch fired:", orderErr);
          try { await stripeRefund(piId); } catch {}
          navigate(ORDER_RESULT_ROUTE, {
            state: { success: false, reason: "order_failed", refunded: true },
          });
        }
      }
    } catch (payErr) {
      console.error("[Checkout] payment catch fired:", payErr);
      setErrorMsg("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Card visual */}
      <div className="checkout-card-visual">
        <div className="checkout-card-top">
          <div className="checkout-card-chip">
            <div className="chip-body" />
            <div className="chip-wave" />
          </div>
        </div>
        <div className="checkout-card-number">4085  9536  8475  9530</div>
        <div className="checkout-card-bottom">
          <span className="checkout-card-holder">{cardholderName || "Cardholder"}</span>
          <div className="checkout-card-logo">
            <span className="mc-circle mc-red" />
            <span className="mc-circle mc-yellow" />
          </div>
        </div>
      </div>

      <input
        className="checkout-input"
        placeholder="Cardholder Name"
        value={cardholderName}
        onChange={(e) => setCardholderName(e.target.value)}
      />

      <div className="checkout-stripe-element">
        <CardNumberElement options={{ style: STRIPE_STYLE }} />
      </div>

      <div className="checkout-input-row">
        <div className="checkout-stripe-element">
          <CardExpiryElement options={{ style: STRIPE_STYLE }} />
        </div>
        <div className="checkout-stripe-element">
          <CardCvcElement options={{ style: STRIPE_STYLE }} />
        </div>
      </div>

      <label className="checkout-billing-check">
        <input
          type="checkbox"
          checked={sameAsBilling}
          onChange={(e) => setSameAsBilling(e.target.checked)}
        />
        Same as billing address
      </label>

      {errorMsg && <div className="checkout-error">{errorMsg}</div>}

      <div className="checkout-actions">
        <button className="checkout-btn-back" onClick={onBack}>Back</button>
        <button
          className="checkout-btn-pay"
          onClick={handlePay}
          disabled={loading || !stripe}
        >
          {loading ? "Processing..." : "Pay"}
        </button>
      </div>
    </>
  );
};

// ── PayPal section ────────────────────────────────────────────────────────────
const PayPalSection = ({ total, basketItems, userId, selectedAddressData, deliveryDate, deliveryPriority, isCredit, onBack }) => {
  const navigate = useNavigate();
  const { order, basket } = useContext(Context);
  const [errorMsg, setErrorMsg] = useState("");
  const [paypalBtnHidden, setPaypalBtnHidden] = useState(false);
  const cardBtnRef = useRef(null);

  useEffect(() => {
    if (isCredit) return;
    const el = cardBtnRef.current;
    if (!el) return;
    let baseHeight = null;
    const ro = new ResizeObserver(([entry]) => {
      const h = entry.contentRect.height;
      if (baseHeight === null) {
        if (h > 20) baseHeight = h;
        return;
      }
      setPaypalBtnHidden(h > baseHeight + 80);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isCredit]);

  const handleCreateOrder = async () => {
    const { id } = await createPayPalOrder(Math.round(total * 100));
    return id;
  };

  const handleApprove = async (data) => {
    setErrorMsg("");
    let captureId = null;
    try {
      const capture = await capturePayPalOrder(data.orderID);
      captureId = capture?.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? null;

      const { phone, email, country, stateProvince, zipPostalCode, firstName, lastName, addressLine } = order.contactInfo;
      const addr = selectedAddressData || {};
      console.log("[Checkout/PayPal] contactInfo (basket form):", { firstName, lastName, email, phone });
      console.log("[Checkout/PayPal] selectedAddress full_name:", addr.full_name);
      const orderPayload = {
        userId,
        devices: basketItems.map((d) => ({ deviceId: d.id, quantity: d.quantity })),
        payment: isCredit ? "paypal_credit" : "paypal",
        phoneNumber: addr.phone_number || phone,
        email,
        firstName: firstName || addr.full_name?.split(" ")[0] || "",
        lastName: lastName || addr.full_name?.split(" ").slice(1).join(" ") || "",
        country: addr.country || country,
        stateProvince: addr.state_province || stateProvince,
        zipPostalCode: addr.zip_postal_code || zipPostalCode,
        addressLine: addr.address_line || addressLine,
        deliveryDate,
        deliveryPriority,
        paymentStatus: "paid",
      };
      console.log("[Checkout/PayPal] orderPayload →", { firstName: orderPayload.firstName, lastName: orderPayload.lastName, email: orderPayload.email });
      try {
        const { order: created } = await createOrder(orderPayload);
        basket.clearBasket();
        navigate(ORDER_RESULT_ROUTE, {
          state: {
            success: true,
            orderId: created.order_number || created.id,
            total,
            payment: isCredit ? "paypal_credit" : "paypal",
            items: basketItems.map(({ id, name, price, img, quantity }) => ({
              id, name, price, quantity,
              img: Array.isArray(img) ? img[0] : img,
            })),
          },
        });
      } catch {
        if (captureId) { try { await paypalRefund(captureId); } catch {} }
        navigate(ORDER_RESULT_ROUTE, {
          state: { success: false, reason: "order_failed", refunded: !!captureId },
        });
      }
    } catch {
      navigate(ORDER_RESULT_ROUTE, {
        state: { success: false, reason: "capture_failed", refunded: false },
      });
    }
  };

  return (
    <div className="checkout-paypal-section">
      {isCredit ? (
        <>
          <div className="checkout-paypal-credit-logo">
            <span className="paypal-pay">Pay</span><span className="paypal-pal">Pal</span>
            <span className="paypal-credit-badge">Credit</span>
          </div>
          <div className="checkout-paypal-credit-offer">
            <strong>No Interest</strong> if paid in full in 6 months on purchases of $99 or more.{" "}
            <span className="checkout-paypal-credit-link">Learn more</span>
          </div>
          <p className="checkout-paypal-info">
            Sign in to your PayPal account or apply for PayPal Credit to complete your purchase.
          </p>
        </>
      ) : (
        <>
          <div className="checkout-paypal-logo">
            <span className="paypal-pay">Pay</span><span className="paypal-pal">Pal</span>
          </div>
          <p className="checkout-paypal-info">
            You will be securely redirected to PayPal to complete your payment.
          </p>
        </>
      )}

      {errorMsg && <div className="checkout-error">{errorMsg}</div>}

      <div className={`paypal-blue-section${paypalBtnHidden ? " paypal-blue-section--hidden" : ""}`}>
        <PayPalButtons
          fundingSource={isCredit ? FUNDING.CREDIT : FUNDING.PAYPAL}
          style={{
            color: isCredit ? "white" : "blue",
            shape: "rect",
            label: isCredit ? "credit" : "pay",
            height: 45,
          }}
          createOrder={handleCreateOrder}
          onApprove={handleApprove}
          onError={() => navigate(ORDER_RESULT_ROUTE, { state: { success: false, reason: "payment_failed", refunded: false } })}
        />
        {!isCredit && (
          <div className="paypal-or-divider">
            <span /><span>or</span><span />
          </div>
        )}
      </div>

      {!isCredit && (
        <div ref={cardBtnRef} className={`paypal-card-btn-wrap${paypalBtnHidden ? " paypal-card-btn-wrap--flush" : ""}`}>
          <PayPalButtons
            fundingSource={FUNDING.CARD}
            style={{ shape: "rect", height: 45 }}
            createOrder={handleCreateOrder}
            onApprove={handleApprove}
            onError={() => navigate(ORDER_RESULT_ROUTE, { state: { success: false, reason: "payment_failed", refunded: false } })}
          />
        </div>
      )}

      <div className="checkout-actions">
        <button className="checkout-btn-back" onClick={onBack}>Back</button>
      </div>
    </div>
  );
};

// ── Main Checkout ─────────────────────────────────────────────────────────────
const Checkout = observer(() => {
  const { basket, device, user, order } = useContext(Context);

  const today = new Date();
  const regularDate = addBusinessDays(today, 5);
  const expressDate = today;
  const minScheduleDate = toDateInputValue(addBusinessDays(today, 1));

  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState("free");
  const [scheduledDate, setScheduledDate] = useState(minScheduleDate);
  const [paymentTab, setPaymentTab] = useState("credit");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const shippingDateMap = {
    free: toDateInputValue(regularDate),
    express: toDateInputValue(expressDate),
    schedule: scheduledDate,
  };

  const shippingLabelDate = {
    free: formatShortDate(regularDate),
    express: formatShortDate(expressDate),
    schedule: scheduledDate
      ? new Date(scheduledDate + "T00:00:00").toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
      : "Select Date",
  };

  useEffect(() => {
    if (user.isAuth) {
      fetchAddresses().then((data) => {
        setAddresses(data);
        if (data.length > 0) setSelectedAddress(data[0].id);
      });
    }
  }, [user.isAuth]);

  const handleAddSave = async (form) => {
    if (!user.isAuth) {
      const tempId = `temp_${Date.now()}`;
      setAddresses((prev) => [...prev, { ...form, id: tempId }]);
      setSelectedAddress(tempId);
      setModalOpen(false);
      return;
    }
    const created = await createAddress(form);
    setAddresses((prev) => [...prev, created]);
    setSelectedAddress(created.id);
    setModalOpen(false);
  };

  const handleEditSave = async (form) => {
    if (!user.isAuth) {
      setAddresses((prev) => prev.map((a) => (a.id === editingAddress.id ? { ...form, id: editingAddress.id } : a)));
      setEditingAddress(null);
      return;
    }
    const updated = await updateAddress(editingAddress.id, form);
    setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setEditingAddress(null);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (user.isAuth) await deleteAddress(id);
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (selectedAddress === id) setSelectedAddress(next[0]?.id ?? null);
      return next;
    });
  };

  const openEdit = (addr, e) => {
    e.stopPropagation();
    setEditingAddress(addr);
  };

  const basketItems = basket.basketDevices
    .filter((item) => item.deviceId)
    .map((item) => {
      const found = device.devices.find((d) => d.id === item.deviceId);
      return found ? { ...found, quantity: item.quantity } : null;
    })
    .filter(Boolean);

  const subtotal = basketItems.reduce((sum, d) => sum + d.price * d.quantity, 0);
  const discountAmount = subtotal * (order.discountPercent / 100);
  const total = subtotal - discountAmount;

  const selectedAddressData = addresses.find((a) => a.id === selectedAddress);
  const selectedShippingData = SHIPPING_METHODS.find((s) => s.id === selectedShipping);

  const summaryItems =
    basketItems.length > 0
      ? basketItems
      : [
          { id: 1, name: "Apple iPhone 14 Pro Max 128Gb", price: 1399, img: null },
          { id: 2, name: "AirPods Max Silver", price: 549, img: null },
          { id: 3, name: "Apple Watch Series 9 GPS 41mm", price: 399, img: null },
        ];

  const badgeClass = (type) =>
    type === "HOME" ? "badge-home" : type === "OFFICE" ? "badge-office" : "badge-other";

  return (
    <Container className="checkout-container">
      {/* Stepper */}
      <div className="checkout-stepper">
        {STEP_META.map(({ num, label, Icon }, i) => {
          const state = step === num ? "active" : step > num ? "done" : "inactive";
          return (
            <Fragment key={num}>
              <div className={`checkout-step ${state}`}>
                <div className="checkout-step-circle">
                  <Icon size={14} />
                </div>
                <div className="checkout-step-info">
                  <span className="checkout-step-num">Step {num}</span>
                  <span className="checkout-step-label">{label}</span>
                </div>
              </div>
              {i < STEP_META.length - 1 && <div className="checkout-stepper-line" />}
            </Fragment>
          );
        })}
      </div>

      {/* ── Step 1: Address ── */}
      {step === 1 && (
        <div className="checkout-content">
          <h5 className="checkout-section-title">Select Address</h5>

          <div className="checkout-address-list">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`checkout-address-card ${selectedAddress === addr.id ? "selected" : ""}`}
                onClick={() => setSelectedAddress(addr.id)}
              >
                <input
                  type="radio"
                  className="checkout-radio"
                  readOnly
                  checked={selectedAddress === addr.id}
                />
                <div className="checkout-address-body">
                  <div className="checkout-address-header">
                    <span className="checkout-address-label">{addr.label}</span>
                    <span className={`checkout-badge ${badgeClass(addr.type)}`}>{addr.type}</span>
                  </div>
                  <div className="checkout-address-text">
                    {addr.full_name} &mdash; {addr.address_line}
                    {addr.city ? `, ${addr.city}` : ""}
                    {addr.state_province ? `, ${addr.state_province}` : ""}
                    {addr.zip_postal_code ? ` ${addr.zip_postal_code}` : ""}
                    {addr.country ? `, ${addr.country}` : ""}
                  </div>
                  <div className="checkout-address-phone">{addr.phone_number}</div>
                </div>
                <div className="checkout-address-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="checkout-icon-btn" onClick={(e) => openEdit(addr, e)}>&#9998;</button>
                  <button className="checkout-icon-btn" onClick={(e) => handleDelete(addr.id, e)}>&#10005;</button>
                </div>
              </div>
            ))}

            <div className="checkout-add-address">
              <div className="checkout-add-row">
                <div className="checkout-add-line" />
                <button className="checkout-add-circle" onClick={() => setModalOpen(true)}>+</button>
                <div className="checkout-add-line" />
              </div>
              <span className="checkout-add-text">Add New Address</span>
            </div>
          </div>

          <div className="checkout-actions">
            <button className="checkout-btn-back" onClick={() => window.history.back()}>
              Back
            </button>
            <button
              className="checkout-btn-next"
              onClick={() => setStep(2)}
              disabled={!selectedAddress}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Shipping ── */}
      {step === 2 && (
        <div className="checkout-content">
          <h5 className="checkout-section-title">Shipment Method</h5>

          <div className="checkout-shipping-list">
            {SHIPPING_METHODS.map((method) => (
              <div
                key={method.id}
                className={`checkout-shipping-card ${selectedShipping === method.id ? "selected" : ""}`}
                onClick={() => setSelectedShipping(method.id)}
              >
                <input
                  type="radio"
                  className="checkout-radio"
                  readOnly
                  checked={selectedShipping === method.id}
                />
                <div className="checkout-shipping-body">
                  <span className="checkout-shipping-label">{method.label}</span>
                  <span className="checkout-shipping-desc">{method.desc}</span>
                </div>
                {method.id === "schedule" ? (
                  <input
                    type="date"
                    className="checkout-date-input"
                    value={scheduledDate}
                    min={minScheduleDate}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => { setSelectedShipping("schedule"); setScheduledDate(e.target.value); }}
                  />
                ) : (
                  <span className="checkout-shipping-date">{shippingLabelDate[method.id]}</span>
                )}
              </div>
            ))}
          </div>

          <div className="checkout-actions">
            <button className="checkout-btn-back" onClick={() => setStep(1)}>Back</button>
            <button className="checkout-btn-next" onClick={() => setStep(3)}>Next</button>
          </div>
        </div>
      )}

      {/* ── Step 3: Payment ── */}
      {step === 3 && (
        <div className="checkout-payment-layout">
          {/* Summary */}
          <div className="checkout-summary">
            <h5 className="checkout-summary-title">Summary</h5>

            <div className="checkout-summary-items">
              {summaryItems.map((d) => (
                <div key={d.id} className="checkout-summary-item">
                  {d.img ? (
                    <img
                      src={Array.isArray(d.img) ? d.img[0] : d.img}
                      alt={d.name}
                      className="checkout-summary-img"
                    />
                  ) : (
                    <div className="checkout-summary-img-placeholder" />
                  )}
                  <span className="checkout-summary-name">{d.name.split(",")[0]}</span>
                  <span className="checkout-summary-price">${d.price}</span>
                </div>
              ))}
            </div>

            <div className="checkout-summary-meta">
              <div className="checkout-meta-label">Address</div>
              <div className="checkout-meta-value">
                {selectedAddressData
                  ? `${selectedAddressData.address_line}${selectedAddressData.city ? ", " + selectedAddressData.city : ""}, ${selectedAddressData.country}`
                  : "—"}
              </div>
            </div>
            <div className="checkout-summary-meta">
              <div className="checkout-meta-label">Shipment method</div>
              <div className="checkout-meta-value">
                {selectedShippingData?.label === "Free" ? "Free" : selectedShippingData?.label}
              </div>
            </div>

            <div className="checkout-summary-divider" />

            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {order.discountPercent > 0 && (
              <div className="checkout-summary-row checkout-summary-discount">
                <span>Discount ({order.discountPercent}%) — {order.appliedPromo}</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="checkout-summary-divider" />

            <div className="checkout-summary-row checkout-summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment form */}
          <PayPalScriptProvider options={{
            "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
            currency: "USD",
            "enable-funding": "credit,paylater,card",
          }}>
            <div className="checkout-payment-form">
              <h5 className="checkout-payment-title">Payment</h5>

              <div className="checkout-payment-tabs">
                {[
                  { id: "credit", label: "Credit Card" },
                  { id: "paypal", label: "PayPal" },
                  // { id: "paypal_credit", label: "PayPal Credit" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`checkout-tab-btn ${paymentTab === tab.id ? "active" : ""}`}
                    onClick={() => setPaymentTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {paymentTab === "credit" && (
                <Elements stripe={stripePromise}>
                  <CreditCardSection
                    total={total}
                    basketItems={basketItems}
                    userId={user.user.id}
                    selectedAddressData={selectedAddressData}
                    deliveryDate={shippingDateMap[selectedShipping]}
                    deliveryPriority={SHIPPING_METHODS.find((m) => m.id === selectedShipping)?.priority}
                    onBack={() => setStep(2)}
                  />
                </Elements>
              )}

              {paymentTab === "paypal" && (
                <PayPalSection
                  total={total}
                  basketItems={basketItems}
                  userId={user.user.id}
                  selectedAddressData={selectedAddressData}
                  deliveryDate={shippingDateMap[selectedShipping]}
                  deliveryPriority={SHIPPING_METHODS.find((m) => m.id === selectedShipping)?.priority}
                  isCredit={false}
                  onBack={() => setStep(2)}
                />
              )}

              {/* PayPal Credit — temporarily disabled (region availability)
              {paymentTab === "paypal_credit" && (
                <PayPalSection
                  total={total}
                  basketItems={basketItems}
                  userId={user.user.id}
                  selectedAddressData={selectedAddressData}
                  deliveryDate={shippingDateMap[selectedShipping]}
                  deliveryPriority={SHIPPING_METHODS.find((m) => m.id === selectedShipping)?.priority}
                  isCredit={true}
                  onBack={() => setStep(2)}
                />
              )}
              */}
            </div>
          </PayPalScriptProvider>
        </div>
      )}

      {/* ── Modals ── */}
      {modalOpen && (
        <AddressModal onSave={handleAddSave} onClose={() => setModalOpen(false)} />
      )}
      {editingAddress && (
        <AddressModal
          key={editingAddress.id}
          initial={editingAddress}
          onSave={handleEditSave}
          onClose={() => setEditingAddress(null)}
        />
      )}
    </Container>
  );
});

export default Checkout;
