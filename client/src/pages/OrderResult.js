import { useLocation, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { INDEX_ROUTE, STORE_ROUTE, CHECKOUT_ROUTE } from "../utils/const";
import "../style/OrderResult.css";

const OrderResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Guard: if landed here without state (direct URL), redirect to store
  if (!state) {
    navigate(STORE_ROUTE, { replace: true });
    return null;
  }

  const { success, orderId, total, payment, items = [], reason, refunded } = state;

  const paymentLabel = {
    credit_card: "Credit Card",
    paypal: "PayPal",
    paypal_credit: "PayPal Credit",
  }[payment] ?? payment;

  const failureTitle =
    reason === "order_failed" ? "Order Could Not Be Placed" : "Payment Failed";

  const failureDesc = reason === "order_failed"
    ? refunded
      ? "Your payment was processed but the order could not be saved. A full refund has been initiated — it may take 3–5 business days to appear on your statement."
      : "Your payment was processed but the order could not be saved. Please contact support with your payment reference."
    : "Your payment was not completed. No charge was made to your account.";

  return (
    <Container className="order-result-container">
      {success ? (
        <div className="order-result-card">
          <div className="order-result-icon order-result-icon--success">
            <svg viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="25" stroke="#27ae60" strokeWidth="2" />
              <path d="M14 27l8 8 16-16" stroke="#27ae60" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h3 className="order-result-title">Order Confirmed!</h3>
          <p className="order-result-sub">
            Thank you for your purchase. Your order <strong>#{orderId}</strong> has been placed successfully.
          </p>

          {items.length > 0 && (
            <div className="order-result-items">
              {items.map((item, i) => (
                <div key={i} className="order-result-item">
                  {item.img ? (
                    <img
                      src={Array.isArray(item.img) ? item.img[0] : item.img}
                      alt={item.name}
                      className="order-result-item-img"
                    />
                  ) : (
                    <div className="order-result-item-img order-result-item-img--placeholder" />
                  )}
                  <span className="order-result-item-name">{item.name.split(",")[0]}</span>
                  <span className="order-result-item-qty">×{item.quantity}</span>
                  <span className="order-result-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="order-result-meta">
            <div className="order-result-meta-row">
              <span>Payment</span>
              <span>{paymentLabel}</span>
            </div>
            <div className="order-result-meta-row order-result-meta-total">
              <span>Total paid</span>
              <span>${Number(total).toFixed(2)}</span>
            </div>
          </div>

          <div className="order-result-actions">
            <button className="order-result-btn order-result-btn--secondary" onClick={() => navigate(INDEX_ROUTE)}>
              Back to Home
            </button>
            <button className="order-result-btn order-result-btn--primary" onClick={() => navigate(STORE_ROUTE)}>
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="order-result-card">
          <div className="order-result-icon order-result-icon--failure">
            <svg viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="25" stroke="#e74c3c" strokeWidth="2" />
              <path d="M17 17l18 18M35 17L17 35" stroke="#e74c3c" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          <h3 className="order-result-title">{failureTitle}</h3>
          <p className="order-result-sub">{failureDesc}</p>

          <div className="order-result-actions">
            <button className="order-result-btn order-result-btn--secondary" onClick={() => navigate(INDEX_ROUTE)}>
              Back to Home
            </button>
            <button className="order-result-btn order-result-btn--primary" onClick={() => navigate(CHECKOUT_ROUTE)}>
              Try Again
            </button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default OrderResult;
