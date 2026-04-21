import { useContext, useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { Context } from "..";
import { destroyDeviceFromBasket } from "../http/basketAPI";
import "../style/BasketItem.css";
import { fetchOneDevice } from "../http/deviceAPI";

const BasketItem = ({ basketItem }) => {
  const { user, basket } = useContext(Context);
  const [quantity, setQuantity] = useState(basketItem.quantity);
  const [userDevice, setUserDevice] = useState();

  useEffect(() => {
    fetchOneDevice(basketItem.deviceId).then((data) => setUserDevice(data));
  }, [basketItem.deviceId]);

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
    <div className="basket-row">
      <Image
        src={Array.isArray(userDevice.img) ? userDevice.img[0] : userDevice.img}
        alt={userDevice.name}
        className="basket-image"
      />
      <div className="basket-info">
        <div className="basket-name">{userDevice.name.split(",")[0]}</div>
        <div className="basket-article">#{userDevice.amazonId}</div>
      </div>
      <div className="quantity-control">
        <button
          className="quantity-btn"
          onClick={() => handleQuantityChange(quantity - 1)}
        >
          &minus;
        </button>
        <span className="quantity-value">{quantity}</span>
        <button
          className="quantity-btn"
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          +
        </button>
      </div>
      <div className="basket-price">${userDevice.price}</div>
      <button className="basket-remove-btn" onClick={handleRemove}>
        &times;
      </button>
    </div>
  );
};

export default BasketItem;
