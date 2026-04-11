import React, { useContext } from "react";
import { Button, Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/const";
import "../style/App.css";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { addToBasket } from "../http/basketAPI";
import { FaShoppingCart } from "react-icons/fa";

const DeviceItem = observer(({ device }) => {
  const navigate = useNavigate();
  const { user, basket } = useContext(Context);
  
  const addDeviceToBasket = async (e) => {
    e.stopPropagation(); // Щоб не переходило на сторінку товару при натисканні на кнопку
    try {
      const basketData = {
        userId: user.user.id,
        deviceId: device.id,
        quantity: 1,
      };
      basket.setBasketDevice(basketData);
      await addToBasket(basketData);
      console.log("Product was added");
      return;
    } catch (error) {
      console.log("Failed to add product to basket:", error);
    } 
  };

  const commaIndex = device.name.indexOf(",");
  const titleRaw = commaIndex !== -1 ? device.name.slice(0, commaIndex) : device.name;
  const subtitleRaw = commaIndex !== -1 ? device.name.slice(commaIndex + 1).trim() : "";

  const TITLE_LIMIT = 40;
  const SUBTITLE_LIMIT = 80;
  const title = titleRaw.length > TITLE_LIMIT ? titleRaw.slice(0, TITLE_LIMIT) + "…" : titleRaw;
  const subtitle = subtitleRaw.length > SUBTITLE_LIMIT ? subtitleRaw.slice(0, SUBTITLE_LIMIT) + "…" : subtitleRaw;

  return (
    <Card
      className="device-card"
      border="light"
      onClick={() => navigate(DEVICE_ROUTE + "/" + device.id)}
    >
      <div className="image-container">
        <Image
          src={process.env.REACT_APP_API_URL + '/' + device.img}
          alt={device.name}
          className="device-image-main"
        />
      </div>
      <div className="device-name">
        <span className="device-name-title">{title}</span>
        {subtitle && <span className="device-name-subtitle">{subtitle}</span>}
      </div>
      <div className="device-price">${device.price}</div>
      <Button
        onClick={addDeviceToBasket}
        className="basket-button"
        variant="gray"
      >
        <FaShoppingCart />
      </Button>
    </Card>
  );
});

export default DeviceItem;
