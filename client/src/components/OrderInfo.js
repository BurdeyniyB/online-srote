import React, { useContext, useEffect, useState } from "react";
import "../style/OrderInfo.css"; // Підключаємо стилі
import { Context } from "..";
import { fetchBasket } from "../http/basketAPI";
import CreditCardForm from "./payment/CreditCardForm";

const OrderInfo = () => {
  const { basket, device } = useContext(Context);
  const [country, setCountry] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [total, setTotal] = useState(0);

  const countries = ["USA", "Canada", "Germany", "France", "Ukraine"];
  const statesProvinces = {
    USA: ["California", "Texas", "New York"],
    Canada: ["Ontario", "Quebec"],
    Germany: ["Berlin", "Bavaria"],
    France: ["Paris", "Lyon"],
    Ukraine: ["Kyiv", "Lviv"],
  };

  const paymentMethods = [
    { label: "Credit Card", value: "credit_card" },
    { label: "PayPal", value: "paypal" },
    { label: "Bank Transfer", value: "bank_transfer" },
  ];

  const handlePayment = (data) => {
    console.log("Processing payment with:", data);
    alert("Payment successful!");
  };

  useEffect(() => {
    let newTotal = 0;
  
    basket.basketDevices.forEach((deviceItem) => {
      const foundDevice = device.devices.find((d) => d.id === deviceItem.deviceId);
      if (foundDevice) {
        newTotal += foundDevice.price * deviceItem.quantity;
      }
    });
  
    setTotal(newTotal);
  }, [basket.basketDevices, device.devices]);
  
  

  return (
    <div className="order-info">
      <input placeholder="Enter email" type="email" className="order-input" />
      <input
        placeholder="Enter phone number"
        type="tel"
        className="order-input"
      />

      {/* Дропдаун вибору країни */}
      <select
        className="order-dropdown"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      >
        <option value="">Select Country</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Дропдаун вибору штату/провінції (залежить від країни) */}
      <select
        className="order-dropdown"
        value={stateProvince}
        onChange={(e) => setStateProvince(e.target.value)}
        disabled={!country}
      >
        <option value="">Select State/Province</option>
        {country &&
          statesProvinces[country]?.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
      </select>

      <input
        placeholder="Enter ZIP Code"
        type="text"
        className="order-input"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
      />
      
      <div className="order-total">Total: ${total.toFixed(2)}</div>

      {/* Вибір методу оплати */}
      <div className="order-payment">
        {paymentMethods.map((method) => (
          <label key={method.value} className="payment-label">
            <input
              type="radio"
              name="payment"
              value={method.value}
              checked={paymentMethod === method.value}
              onChange={() => setPaymentMethod(method.value)}
            />
            {method.label}
          </label>
        ))}
      </div>

      {paymentMethod === "credit_card" && (
        <CreditCardForm onSubmit={handlePayment} />
      )}
    </div>
  );
};

export default OrderInfo;
