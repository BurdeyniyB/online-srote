import React, { useContext } from "react";
import { Button, Card, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/const";
import "../style/App.css";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { addToBasket } from "../http/basketAPI";
import { FaShoppingCart } from "react-icons/fa"; // Іконка кошика

const DeviceItem = observer(({ device }) => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  
  const addDeviceToBasket = async (e) => {
    e.stopPropagation(); // Щоб не переходило на сторінку товару при натисканні на кнопку
    try {
      const basketData = {
        userId: user.user.id,
        deviceId: device.id,
      };
      await addToBasket(basketData);
      console.log("Product was added");
    } catch (error) {
      console.error("Failed to add product to basket:", error);
    }
  };

  return (
    <Col
      md={3}
      className="mb-4 col-position"
      onClick={() => navigate(DEVICE_ROUTE + "/" + device.id)}
    >
      <Card className="device-card" border="light">
        <div className="image-container">
          <Image
            src={process.env.REACT_APP_API_URL + device.img}
            alt={device.name}
            className="device-image-main"
          />
        </div>
        <div className="device-name">{device.name}</div>
        <div className="device-price">{device.price} грн</div>
        <Button
          onClick={addDeviceToBasket}
          className="basket-button"
          variant="gray"
        >
          <FaShoppingCart />
        </Button>
      </Card>
    </Col>
  );
});

export default DeviceItem;
