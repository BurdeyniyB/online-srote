import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/OrderInfo.css";
import { Context } from "..";
import { CHECKOUT_ROUTE } from "../utils/const";

const TAX = 50;
const SHIPPING = 29;

const OrderInfo = () => {
  const { basket, device, order } = useContext(Context);
  const navigate = useNavigate();
  const [subtotal, setSubtotal] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [bonusCard, setBonusCard] = useState("");

  const contact = order.contactInfo;
  const setField = (field) => (e) => order.setContactInfo({ [field]: e.target.value });

  useEffect(() => {
    let sum = 0;
    basket.basketDevices.forEach((deviceItem) => {
      const found = device.devices.find((d) => d.id === deviceItem.deviceId);
      if (found) {
        sum += found.price * deviceItem.quantity;
      }
    });
    setSubtotal(sum);
  }, [basket.basketDevices, device.devices]);

  const total = subtotal + TAX + SHIPPING;

  return (
    <div className="order-summary">
      <h5 className="order-summary-title">Order Summary</h5>

      <div className="order-summary-field">
        <label className="order-summary-label">Discount code / Promo code</label>
        <input
          className="order-summary-input"
          placeholder="Code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
      </div>

      <div className="order-summary-field">
        <label className="order-summary-label">Your bonus card number</label>
        <div className="order-bonus-row">
          <input
            className="order-summary-input order-bonus-input"
            placeholder="Enter Card Number"
            value={bonusCard}
            onChange={(e) => setBonusCard(e.target.value)}
          />
          <button className="order-apply-btn">Apply</button>
        </div>
      </div>

      <div className="order-summary-field">
        <label className="order-summary-label">Phone Number</label>
        <input
          className="order-summary-input"
          placeholder="+1 (555) 000-0000"
          value={contact.phone}
          onChange={setField("phone")}
        />
      </div>

      <div className="order-summary-field">
        <label className="order-summary-label">Email</label>
        <input
          className="order-summary-input"
          type="email"
          placeholder="you@example.com"
          value={contact.email}
          onChange={setField("email")}
        />
      </div>

      <div className="order-summary-field">
        <label className="order-summary-label">Country</label>
        <input
          className="order-summary-input"
          placeholder="United States"
          value={contact.country}
          onChange={setField("country")}
        />
      </div>

      <div className="order-summary-field">
        <label className="order-summary-label">State / Province</label>
        <input
          className="order-summary-input"
          placeholder="California"
          value={contact.stateProvince}
          onChange={setField("stateProvince")}
        />
      </div>

      <div className="order-summary-field">
        <label className="order-summary-label">ZIP / Postal Code</label>
        <input
          className="order-summary-input"
          placeholder="90210"
          value={contact.zipPostalCode}
          onChange={setField("zipPostalCode")}
        />
      </div>

      <div className="order-summary-divider" />

      <div className="order-summary-row">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="order-summary-row">
        <span>Estimated Tax</span>
        <span>${TAX}</span>
      </div>
      <div className="order-summary-row">
        <span>Estimated shipping &amp; Handling</span>
        <span>${SHIPPING}</span>
      </div>

      <div className="order-summary-divider" />

      <div className="order-summary-row order-summary-total">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <button className="order-checkout-btn" onClick={() => navigate(CHECKOUT_ROUTE)}>Checkout</button>
    </div>
  );
};

export default OrderInfo;
