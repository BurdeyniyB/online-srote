import React, { useContext, useEffect, useState } from "react";
import { Card, Image, Button } from "react-bootstrap";
import { Context } from "..";
import { destroyDeviceFromBasket } from "../http/basketAPI";
import { FaTimes, FaMinus, FaPlus } from "react-icons/fa";
import "../style/BasketItem.css";
import { fetchDevices } from "../http/deviceAPI";

const BasketItem = ({ basketItem }) => {
  const { user, device, basket } = useContext(Context);
  const [quantity, setQuantity] = useState(basketItem.quantity);
  const [userDevice, setUserDevice] = useState();

  useEffect(() => {
    fetchDevices(
      null,
      null,
      null,
      null,
      "date_desc",
      1,
      device.limit,
      null
    ).then((data) => {
      device.setDevices(data.rows);
      device.setTotalCount(data.count);
      setUserDevice(device.devices.find((d) => d.id === basketItem.deviceId));
    });
  }, []);

  console.log("Device: " + JSON.stringify(device.devices));

  if (!userDevice) {
    return <div className="basket-item">Device not found</div>;
  }

  const handleRemove = async () => {
    try {
      basket.removeBasketDevice(basketItem.deviceId);
      await destroyDeviceFromBasket({
        userId: user.user.id,
        deviceId: basketItem.deviceId,
      });
      console.log("Product was removed");
    } catch (error) {
      console.log("Failed to remove device from basket:", error);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    basket.setQuantity({
      deviceId: basketItem.deviceId,
      quantity: newQuantity,
    });
  };

  return (
    <Card className="basket-card">
      <div className="basket-content">
        <Image
          src={process.env.REACT_APP_API_URL + userDevice.img}
          rounded
          alt={userDevice.name}
          className="basket-image"
        />
          <div className="basket-name">{userDevice.name}</div>
          <div className="quantity-control">
            <button
              className="quantity-btn"
              onClick={() => handleQuantityChange(basketItem.quantity - 1)}
            >
              <FaMinus />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(parseInt(e.target.value) || 1)
              }
              min="1"
            />
            <button
              className="quantity-btn"
              onClick={() => handleQuantityChange(basketItem.quantity + 1)}
            >
              <FaPlus />
            </button>
          </div>
        <div className="basket-price">{userDevice.price} $</div>
        <button onClick={handleRemove} className="basket-remove-btn">
          <FaTimes />
        </button>
      </div>
    </Card>
  );
};

export default BasketItem;
