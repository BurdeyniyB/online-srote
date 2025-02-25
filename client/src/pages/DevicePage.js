import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchOneDevice } from "../http/deviceAPI";
import { addToBasket } from "../http/basketAPI";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import "../style/DevicePage.css"; // Імпорт стилів

const DevicePage = observer(() => {
  const { user } = useContext(Context);
  const [device, setDevice] = useState({ info: [] });
  const { id } = useParams();

  useEffect(() => {
    fetchOneDevice(id).then((data) => setDevice(data));
  }, [id]);

  const addDeviceToBasket = async () => {
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
    <Container className="device-page">
      <div className="device-container">
        <Image
          width={300}
          className="device-image"
          src={`${process.env.REACT_APP_API_URL}${device.img}`}
          alt={device.name}
        />
        <div className="device-info">
          <h2>{device.name}</h2>
          <p>{device.description}</p>
          <p><strong>Price:</strong> {device.price} $</p>
          <Button variant="outline-dark" className="add-to-basket" onClick={addDeviceToBasket}>
            Add to basket
          </Button>

          {/* Characteristics section */}
          <div className="device-characteristics">
            <h1>Characteristics</h1>
            <div className="characteristics-grid">
              {device.info.map((info) => (
                <div key={info.id} className="characteristics-item">
                  <strong>{info.title}:</strong> {info.description}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
});

export default DevicePage;
