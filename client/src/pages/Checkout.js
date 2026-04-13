import { useState, useContext, Fragment } from "react";
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
import { Context } from "..";
import { createPaymentIntent } from "../http/paymentAPI";
import { createOrder } from "../http/orderAPI";
import "../style/Checkout.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const STRIPE_STYLE = {
  base: {
    fontSize: "14px",
    color: "#333",
    "::placeholder": { color: "#bbb" },
  },
};

const MOCK_ADDRESSES = [
  {
    id: 1,
    label: "2118 Thornridge",
    type: "HOME",
    address: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
    phone: "(209) 555-0104",
  },
  {
    id: 2,
    label: "Headoffice",
    type: "OFFICE",
    address: "2715 Ash Dr. San Jose, South Dakota 83475",
    phone: "(704) 555-0127",
  },
];

const SHIPPING_METHODS = [
  { id: "free", label: "Free", desc: "Regulary shipment", date: "17 Oct, 2023" },
  { id: "express", label: "$8.50", desc: "Get your delivery as soon as possible", date: "1 Oct, 2023" },
  { id: "schedule", label: "Schedule", desc: "Pick a date when you want to get your delivery", date: "Select Date" },
];

const TAX = 50;
const SHIPPING_COST = 29;

const STEP_META = [
  { num: 1, label: "Address", Icon: FaMapMarkerAlt },
  { num: 2, label: "Shipping", Icon: FaTruck },
  { num: 3, label: "Payment", Icon: FaCreditCard },
];

// ── Credit Card form (must be inside <Elements>) ──────────────────────────────
const CreditCardSection = ({ total, basketItems, userId, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
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
      } else if (paymentIntent?.status === "succeeded") {
        await createOrder({
          userId,
          devices: basketItems.map((d) => ({ deviceId: d.id, quantity: d.quantity })),
          payment: "credit_card",
        });
        navigate("/");
      }
    } catch {
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

// ── Main Checkout ─────────────────────────────────────────────────────────────
const Checkout = observer(() => {
  const { basket, device, user } = useContext(Context);

  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [selectedShipping, setSelectedShipping] = useState("free");
  const [paymentTab, setPaymentTab] = useState("credit");
  const [paypalEmail, setPaypalEmail] = useState("");

  const basketItems = basket.basketDevices
    .filter((item) => item.deviceId)
    .map((item) => {
      const found = device.devices.find((d) => d.id === item.deviceId);
      return found ? { ...found, quantity: item.quantity } : null;
    })
    .filter(Boolean);

  const subtotal = basketItems.reduce((sum, d) => sum + d.price * d.quantity, 0);
  const total = subtotal + TAX + SHIPPING_COST;

  const selectedAddressData = MOCK_ADDRESSES.find((a) => a.id === selectedAddress);
  const selectedShippingData = SHIPPING_METHODS.find((s) => s.id === selectedShipping);

  const displaySubtotal = subtotal > 0 ? `$${subtotal.toFixed(2)}` : "$2347";
  const displayTotal = subtotal > 0 ? `$${total.toFixed(2)}` : "$2426";

  const summaryItems =
    basketItems.length > 0
      ? basketItems
      : [
          { id: 1, name: "Apple iPhone 14 Pro Max 128Gb", price: 1399, img: null },
          { id: 2, name: "AirPods Max Silver", price: 549, img: null },
          { id: 3, name: "Apple Watch Series 9 GPS 41mm", price: 399, img: null },
        ];

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
            {MOCK_ADDRESSES.map((addr) => (
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
                    <span className={`checkout-badge ${addr.type === "HOME" ? "badge-home" : "badge-office"}`}>
                      {addr.type}
                    </span>
                  </div>
                  <div className="checkout-address-text">{addr.address}</div>
                  <div className="checkout-address-phone">{addr.phone}</div>
                </div>
                <div className="checkout-address-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="checkout-icon-btn">&#9998;</button>
                  <button className="checkout-icon-btn">&#10005;</button>
                </div>
              </div>
            ))}

            <div className="checkout-add-address">
              <div className="checkout-add-row">
                <div className="checkout-add-line" />
                <button className="checkout-add-circle">+</button>
                <div className="checkout-add-line" />
              </div>
              <span className="checkout-add-text">Add New Address</span>
            </div>
          </div>

          <div className="checkout-actions">
            <button className="checkout-btn-back" onClick={() => window.history.back()}>
              Back
            </button>
            <button className="checkout-btn-next" onClick={() => setStep(2)}>
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
                <span className="checkout-shipping-date">{method.date}</span>
              </div>
            ))}
          </div>

          <div className="checkout-actions">
            <button className="checkout-btn-back" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="checkout-btn-next" onClick={() => setStep(3)}>
              Next
            </button>
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
              <div className="checkout-meta-value">{selectedAddressData?.address}</div>
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
              <span>{displaySubtotal}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Estimated Tax</span>
              <span>${TAX}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Estimated shipping &amp; Handling</span>
              <span>${SHIPPING_COST}</span>
            </div>

            <div className="checkout-summary-divider" />

            <div className="checkout-summary-row checkout-summary-total">
              <span>Total</span>
              <span>{displayTotal}</span>
            </div>
          </div>

          {/* Payment form */}
          <div className="checkout-payment-form">
            <h5 className="checkout-payment-title">Payment</h5>

            <div className="checkout-payment-tabs">
              {[
                { id: "credit", label: "Credit Card" },
                { id: "paypal", label: "PayPal" },
                { id: "paypal_credit", label: "PayPal Credit" },
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
                  onBack={() => setStep(2)}
                />
              </Elements>
            )}

            {paymentTab === "paypal" && (
              <div className="checkout-paypal-section">
                <div className="checkout-paypal-logo">
                  <span className="paypal-pay">Pay</span><span className="paypal-pal">Pal</span>
                </div>
                <p className="checkout-paypal-info">
                  You will be securely redirected to PayPal to complete your payment.
                </p>
                <input
                  className="checkout-input"
                  type="email"
                  placeholder="PayPal Email Address"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                />
                <div className="checkout-paypal-or"><span>or</span></div>
                <button className="checkout-btn-paypal">
                  <span className="paypal-pay">Pay</span><span className="paypal-pal">Pal</span> Checkout
                </button>
                <div className="checkout-actions">
                  <button className="checkout-btn-back" onClick={() => setStep(2)}>Back</button>
                </div>
              </div>
            )}

            {paymentTab === "paypal_credit" && (
              <div className="checkout-paypal-credit-section">
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
                <button className="checkout-btn-paypal-credit">Apply for PayPal Credit</button>
                <div className="checkout-actions">
                  <button className="checkout-btn-back" onClick={() => setStep(2)}>Back</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Container>
  );
});

export default Checkout;
