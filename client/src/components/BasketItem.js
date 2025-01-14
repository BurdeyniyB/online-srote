import React, { useContext, useEffect, useState } from "react";
import { Card, Image, Row } from "react-bootstrap";
import { Context } from "..";
import { fetchDevices } from "../http/deviceAPI";

const BasketItem = ({ basketItem }) => {
  const { device } = useContext(Context);
  const [loading, setLoading] = useState(true); // Стан для відслідковування завантаження

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const data = await fetchDevices(null, null, null, null);
        device.setDevices(data.rows);
        device.setTotalCount(data.count);
        setLoading(false); // Дані завантажені, оновлюємо стан
      } catch (error) {
        console.error("Failed to fetch devices:", error);
        setLoading(false); // Якщо сталася помилка, не зависає в стані завантаження
      }
    };
    loadDevices();
  }, [device]);

  const userDevice = device.devices.find((d) => d.id === basketItem.deviceId);

  // Показуємо лоадер або порожній компонент, поки дані не завантажені
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userDevice) {
    // Якщо девайс не знайдений
    return <Row className="mb-4">Device not found</Row>;
  }

  return (
    <Row className="mb-4">
      <Card className="p-3 d-flex flex-row align-items-center">
        <Image
          src={process.env.REACT_APP_API_URL + userDevice.img}
          rounded
          width={100}
          height={100}
          alt={userDevice.name}
          className="me-3"
        />
        <div className="me-auto">
          <div><strong>Name:</strong> {userDevice.name}</div>
          <div><strong>Price:</strong> ${userDevice.price}</div>
        </div>
      </Card>
    </Row>
  );
};

export default BasketItem;
