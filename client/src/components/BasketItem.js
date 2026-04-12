import { useContext, useEffect, useState, useRef } from "react";
import { Image } from "react-bootstrap";
import { Context } from "..";
import { destroyDeviceFromBasket } from "../http/basketAPI";
import { FaMinus, FaPlus, FaEllipsisV } from "react-icons/fa";
import "../style/BasketItem.css";
import { fetchDevices } from "../http/deviceAPI";

const BasketItem = ({ basketItem }) => {
  const { user, device, basket } = useContext(Context);
  const [quantity, setQuantity] = useState(basketItem.quantity);
  const [userDevice, setUserDevice] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!userDevice) {
    return <div className="basket-item">Device not found</div>;
  }

  const handleRemove = async () => {
    setMenuOpen(false);
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
        {userDevice.brand?.name && (
          <div className="basket-seller">Seller: {userDevice.brand.name}</div>
        )}
      </div>
      <div className="quantity-control">
        <button
          className="quantity-btn"
          onClick={() => handleQuantityChange(quantity - 1)}
        >
          <FaMinus />
        </button>
        <span className="quantity-value">{quantity}</span>
        <button
          className="quantity-btn"
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          <FaPlus />
        </button>
      </div>
      <div className="basket-price">{userDevice.price} ₴</div>
      <div className="basket-menu" ref={menuRef}>
        <button
          className="kebab-btn"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <FaEllipsisV />
        </button>
        {menuOpen && (
          <div className="kebab-dropdown">
            <button onClick={handleRemove}>Remove</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasketItem;
