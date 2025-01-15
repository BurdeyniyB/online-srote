import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Image, Row } from "react-bootstrap";
import { Context } from "..";
import { fetchDevices } from "../http/deviceAPI";
import { destroyDeviceFromBasket } from "../http/basketAPI";

const BasketItem = ({ basketItem }) => {
  const { user, device, basket } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const data = await fetchDevices(null, null, null, null);
        device.setDevices(data.rows);
        device.setTotalCount(data.count);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch devices:", error);
        setLoading(false); 
      }
    };
    loadDevices();
  }, [device]);

  const userDevice = device.devices.find((d) => d.id === basketItem.deviceId);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userDevice) {
    return <Row className="mb-4">Device not found</Row>;
  }

  const handleRemove = async() => {
    try {
      const basketData = {
        userId: user.user.id,
        deviceId: basketItem.deviceId
      };
      await destroyDeviceFromBasket(basketData);
      basket.removeBasketDevice(basketItem.deviceId)
      console.log("Product was removed");
    } catch (error) {
      console.log("Failed to remove device from basket:", error);
    }
  };
  

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
        <Button variant="danger" onClick={handleRemove}>
          Trash
        </Button>
      </Card>
    </Row>
  );
};

export default BasketItem;
