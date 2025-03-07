import React, { useContext, useEffect } from "react";
import { Context } from "..";
import BasketItem from "../components/BasketItem";
import { Button, Container } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { fetchBasket } from "../http/basketAPI";
import "../style/Basket.css";
import OrderInfo from "../components/OrderInfo";

const Basket = observer(() => {
  const { basket, user } = useContext(Context);

  useEffect(() => {
    if (user.user.id) {
      fetchBasket(user.user.id).then((data) => basket.setBasketDevice(data));
    }
  }, [basket, user]);

  return (
    <Container className="mt-3">
      <div className="order-info-container">
        <div className="basket-devices">
          <h2>Shopping Cart</h2>
          {basket.basketDevices
            .filter((basketItem) => basketItem.deviceId) // Фільтруємо елементи без ID
            .map((basketItem) => (
              <BasketItem key={basketItem.deviceId} basketItem={basketItem} />
            ))}
        </div>

        {/* Контейнер для інформації про замовлення та кнопки */}
        <div className="order-details">
          <OrderInfo />
        </div>
      </div>
    </Container>
  );
});

export default Basket;
