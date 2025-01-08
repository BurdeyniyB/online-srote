import React from "react";
import { Button, Container, Image, Row } from "react-bootstrap";

const DevicePage = () => {
  const device = {
    id: 2,
    name: "Iphone 12 pro",
    descriprion: "description iphone 12 pro",
    price: 25000,
    img: "https://cdn.new-brz.net/app/public/models/MGMN3/large/w/201230150020239921.webp",
  };
  const descriprion = [
    { id: 1, title: "RAM", description: "8GB" },
    { id: 2, title: "Battery", description: "4000mAh" },
  ];
  return (
    <Container>
      <div>
        <Image width={300} src={device.img} />
        <h2>{device.name}</h2>
        <div>
          <p>{device.descriprion}</p>
          <p>{device.price}</p>
          <Button className="mb-2" variant="outline-dark">Add to basket</Button>
        </div>
      </div>
      <div className='d-xl-flex flex-column'>
        <h1>Characteristics</h1>
        {descriprion.map((info, index) =>
            <Row key={info.id} style={{background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10}}>
              {info.title}: {info.description}
            </Row>
          )}
      </div>
    </Container>
  );
};

export default DevicePage;
