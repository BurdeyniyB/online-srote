import React, { useContext, useEffect, useState } from "react";
import { Context } from "..";
import BasketItem from "../components/BasketItem";
import { Button, Container } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import CreateOrder from "../components/models/CreateOrder";
import { fetchBasket } from "../http/basketAPI";

const Basket = observer(() => {
  const { basket, user } = useContext(Context);
  const [orderVisible, setOrderVisible] = useState(false);

  useEffect(() => {
    if (user.user.id) {
      fetchBasket(user.user.id).then((data) => basket.setBasketDevice(data));
    }
  }, [basket, user]);

  return (
    <Container className="mt-3">
      {basket.basketDevices
          .filter((basketItem) => basketItem.deviceId) // Фільтруємо елементи без ID
          .map((basketItem) => (
            <BasketItem key={basketItem.deviceId} basketItem={basketItem} />
          ))
      }
      <div className="text-end">
        <Button
          className="text-end mb-4"
          variant="success"
          size="lg"
          onClick={() => setOrderVisible(true)}
        >
          Buy Now
        </Button>
      </div>
      <CreateOrder show={orderVisible} onHide={() => setOrderVisible(false)} />
    </Container>
  );
});

export default Basket;
