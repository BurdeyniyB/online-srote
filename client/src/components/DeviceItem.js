import { useContext } from "react";
import { Button, Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/const";
import "../style/App.css";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { addToBasket } from "../http/basketAPI";
import { FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

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

  const discountedPrice = device.sale > 0
    ? (device.price * (1 - device.sale / 100)).toFixed(2)
    : null;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="star-filled" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="star-filled" />);
      } else {
        stars.push(<FaRegStar key={i} className="star-empty" />);
      }
    }
    return stars;
  };

  return (
    <Card
      className="device-card"
      border="light"
      onClick={() => {
        try {
          const stored = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
          const updated = [device, ...stored.filter((d) => d.id !== device.id)].slice(0, 8);
          localStorage.setItem("recentlyViewed", JSON.stringify(updated));
        } catch (e) {}
        navigate(DEVICE_ROUTE + "/" + device.id);
      }}
    >
      <div className="image-container">
        <Image
          src={Array.isArray(device.img) ? device.img[0] : device.img}
          alt={device.name}
          className="device-image-main"
        />
      </div>
      <div className="device-name">
        <span className="device-name-title">{title}</span>
        {subtitle && <span className="device-name-subtitle">{subtitle}</span>}
      </div>

      <div className="device-meta">
        <div className="device-rating">
          {device.rating != null ? (
            <>
              {renderStars(device.rating)}
              <span className="device-rating-value">{device.rating.toFixed(1)}</span>
            </>
          ) : (
            <span className="device-rating-none">No rating</span>
          )}
        </div>
        <div className={`device-stock ${device.inStock ? "device-stock--in" : "device-stock--out"}`}>
          {device.inStock ? "In Stock" : "Out of Stock"}
        </div>
      </div>

      <div className="device-price">
        {discountedPrice ? (
          <div className="device-price-sale">
            <span className="device-price-current">${discountedPrice}</span>
            <span className="device-price-old">${device.price}</span>
          </div>
        ) : (
          <span>${device.price}</span>
        )}
      </div>

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
