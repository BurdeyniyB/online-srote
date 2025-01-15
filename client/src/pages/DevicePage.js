import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Image, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchOneDevice } from "../http/deviceAPI";
import { addToBasket } from "../http/basketAPI";
import { Context } from "..";
import { observer } from "mobx-react-lite";

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
    <Container>
      <div className="device-details">
        <Image
          width={300}
          src={`${process.env.REACT_APP_API_URL}${device.img}`}
          alt={device.name}
        />
        <h2>{device.name}</h2>
        <div>
          <p>{device.description}</p>
          <p>{device.price} $</p>
          <Button
            className="mb-2"
            variant="outline-dark"
            onClick={addDeviceToBasket}
          >
            Add to basket
          </Button>
        </div>
      </div>
      <div className="device-characteristics">
        <h1>Characteristics</h1>
        {device.info.map((info, index) => (
          <Row
            key={info.id}
            style={{
              background: index % 2 === 0 ? "lightgray" : "transparent",
              padding: 10,
            }}
          >
            <strong>{info.title}:</strong> {info.description}
          </Row>
        ))}
      </div>
    </Container>
  );
});

export default DevicePage;
