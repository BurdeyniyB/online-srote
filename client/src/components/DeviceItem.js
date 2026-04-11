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

  const truncate = (str, limit) => {
    if (str.length <= limit) return str;
    const cut = str.slice(0, limit);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
  };

  const title = truncate(titleRaw, 40);
  const subtitle = truncate(subtitleRaw, 80);

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
