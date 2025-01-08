import React, { useEffect, useState } from "react";
import { Button, Container, Image, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchOneDevice } from "../http/deviceAPI";

const DevicePage = () => {
  const [device, setDevice] = useState({info:[]})
  const {id} = useParams();
  useEffect(() => {
    fetchOneDevice(id).then(data => setDevice(data))
  }, [device])
  return (
    <Container>
      <div>
        <Image width={300} src={process.env.REACT_APP_API_URL + device.img} />
        <h2>{device.name}</h2>
        <div>
          <p>{device.descriprion}</p>
          <p>{device.price}</p>
          <Button className="mb-2" variant="outline-dark">Add to basket</Button>
        </div>
      </div>
      <div className='d-xl-flex flex-column'>
        <h1>Characteristics</h1>
        {device.info.map((info, index) =>
            <Row key={info.id} style={{background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10}}>
              {info.title}: {info.description}
            </Row>
          )}
      </div>
    </Container>
  );
};

export default DevicePage;
