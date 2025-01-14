import React, { useContext } from "react";
import { Context } from "..";
import BasketItem from "../components/BasketItem";
import { Button, Container } from "react-bootstrap";
import { observer } from "mobx-react-lite";

const Basket = observer(() => {
  const { basket, user } = useContext(Context);  // Отримання обох контекстів одразу
  const userBasket = basket.baskets.find((b) => b.userId === user.user.id);
  const basketDevices = userBasket 
    ? basket.basketDevices.filter((d) => d.basketId === userBasket.id) 
    : [];

  return (
    <Container className="mt-3">
      {basketDevices.length > 0 ? (
        basketDevices.map((basketItem) => (
          <BasketItem key={basketItem.id} basketItem={basketItem} />
        ))
      ) : (
        <p>Your basket is empty.</p>
      )}
      <div className="text-end mt-4">
        <Button variant="success" size="lg">
          Buy Now
        </Button>
      </div>
    </Container>
  );
});

export default Basket;
