import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import "../style/OrderInfo.css";
import { Context } from "..";
import { CHECKOUT_ROUTE } from "../utils/const";

// Mock promo codes → discount %
const PROMO_CODES = {
  SAVE5: 5,
  WELCOME5: 5,
  PROMO5: 5,
};

const OrderInfo = observer(() => {
  const { basket, device, order, user } = useContext(Context);
  const navigate = useNavigate();
  const [subtotal, setSubtotal] = useState(0);
  const [promoInput, setPromoInput] = useState(order.appliedPromo);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    if (user.isAuth && user.user.email) {
      order.setContactInfo({ email: user.user.email });
    }
  }, [user.isAuth, user.user.email, order]);

  useEffect(() => {
    let sum = 0;
    basket.basketDevices.forEach((item) => {
      const found = device.devices.find((d) => d.id === item.deviceId);
      if (found) sum += found.price * item.quantity;
    });
    setSubtotal(sum);
  }, [basket.basketDevices, device.devices]);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      order.setDiscount(PROMO_CODES[code], code);
      setPromoError("");
    } else {
      order.clearDiscount();
      setPromoError("Invalid promo code.");
    }
  };

  const handlePromoKeyDown = (e) => {
    if (e.key === "Enter") handleApplyPromo();
  };

  const discountAmount = subtotal * (order.discountPercent / 100);
  const total = subtotal - discountAmount;

  return (
    <div className="order-summary">
      <h5 className="order-summary-title">Order Summary</h5>

      <div className="order-summary-field">
        <label className="order-summary-label">Full Name</label>
        <div className="order-bonus-row">
          <input
            className="order-summary-input order-bonus-input"
            placeholder="First name"
            value={order.contactInfo.firstName}
            onChange={(e) => order.setContactInfo({ firstName: e.target.value })}
          />
          <input
            className="order-summary-input order-bonus-input"
            placeholder="Last name"
            value={order.contactInfo.lastName}
            onChange={(e) => order.setContactInfo({ lastName: e.target.value })}
          />
        </div>
      </div>

      <div className="order-summary-field">
        <label className="order-summary-label">Email</label>
        <input
          className="order-summary-input"
          type="email"
          placeholder="you@example.com"
          value={order.contactInfo.email}
          onChange={(e) => order.setContactInfo({ email: e.target.value })}
        />
      </div>

      <div className="order-summary-field">
        <label className="order-summary-label">Promo code</label>
        <div className="order-bonus-row">
          <input
            className={`order-summary-input order-bonus-input${promoError ? " order-input-error" : order.discountPercent ? " order-input-success" : ""}`}
            placeholder="Enter code"
            value={promoInput}
            onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
            onKeyDown={handlePromoKeyDown}
          />
          <button className="order-apply-btn" onClick={handleApplyPromo}>Apply</button>
        </div>
        {promoError && <span className="order-promo-error">{promoError}</span>}
        {order.discountPercent > 0 && !promoError && (
          <span className="order-promo-success">
            Code <strong>{order.appliedPromo}</strong> applied — {order.discountPercent}% off
          </span>
        )}
      </div>

      <div className="order-summary-divider" />

      <div className="order-summary-row">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {order.discountPercent > 0 && (
        <div className="order-summary-row order-summary-discount">
          <span>Discount ({order.discountPercent}%)</span>
          <span>-${discountAmount.toFixed(2)}</span>
        </div>
      )}

      <div className="order-summary-divider" />

      <div className="order-summary-row order-summary-total">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <button className="order-checkout-btn" onClick={() => navigate(CHECKOUT_ROUTE)}>
        Checkout
      </button>
    </div>
  );
});

export default OrderInfo;
