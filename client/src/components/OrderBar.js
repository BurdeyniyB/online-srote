import React, { useContext, useEffect, useState } from "react";
import { Context } from "../index";
import { fetchOrder, removeOrder } from "../http/orderAPI";
import { observer } from "mobx-react-lite";
import { Button, Card, ListGroup, Container, Row, Col } from "react-bootstrap"; 

const OrderBar = observer(() => {
  const { order } = useContext(Context);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await fetchOrder(page, 10);
      if (data.orders.length > 0) {
        const uniqueOrders = data.orders.filter(
          (newOrder) => !order.orderDevices.some((existingOrder) => existingOrder.id === newOrder.id)
        );
        if (uniqueOrders.length > 0) {
          order.setOrderDevices([...order.orderDevices, ...uniqueOrders]);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await removeOrder(orderId);
      order.setOrderDevices(order.orderDevices.filter((item) => item.id !== orderId));
    } catch (error) {
      console.error(`Failed to delete order with ID ${orderId}`, error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Order List</h1>
      <Row>
        {order.orderDevices.map((orderItem) => (
          <Col key={orderItem.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Order #{orderItem.id}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Phone Number: {orderItem.phone_number}</Card.Subtitle>
                <Card.Text>Address: {orderItem.address}</Card.Text>
                <ListGroup variant="flush">
                  {orderItem.order_devices.map((device) => (
                    <ListGroup.Item key={device.id}>Device ID: {device.deviceId}</ListGroup.Item>
                  ))}
                </ListGroup>
                <Button 
                  variant="danger" 
                  className="mt-3" 
                  onClick={() => handleDeleteOrder(orderItem.id)}
                >
                  Mark as Completed
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {!hasMore && <p className="text-center">No more orders to show.</p>}
    </Container>
  );
});

export default OrderBar;
