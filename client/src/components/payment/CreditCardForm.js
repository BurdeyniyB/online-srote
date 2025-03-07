import React, { useState } from "react";
import "../../style/payment/CreditCardForm.css"; // Підключення стилів

const CreditCardForm = ({ onSubmit }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(value);
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Видаляємо всі нечислові символи
    const isBackspace = e.nativeEvent.inputType === "deleteContentBackward";
  
    if (value.length > 4) {
      value = value.slice(0, 4); // Обмеження довжини
    }
  
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2); // Додаємо "/" тільки якщо не Backspace
    } else 
    if (value.length === 2 && !isBackspace) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    } 
  
    setExpiryDate(value);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ cardNumber, expiryDate, cvv, cardHolder });
  };

  return (
    <form className="credit-card-form" onSubmit={handleSubmit}>
      <img src="/images/Payment/CreditCard.png" alt="CreditCard" />
      <input
        type="text"
        placeholder="Cardholder Name"
        value={cardHolder}
        onChange={(e) => setCardHolder(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Card Number"
        value={cardNumber}
        onChange={handleCardNumberChange}
        maxLength="16"
        required
      />
      <div className="part-block">
        <input
          className="part-size-input"
          type="text"
          placeholder="MM/YY"
          value={expiryDate}
          onChange={handleExpiryDateChange}
          maxLength="5"
          required
        />
        <input
          className="part-size-input"
          type="text"
          placeholder="CVV"
          value={cvv}
          onChange={handleCvvChange}
          maxLength="3"
          required
        />
      </div>
      <button type="submit">Pay</button>
    </form>
  );
};

export default CreditCardForm;
