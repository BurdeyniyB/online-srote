import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../index";
import { Card, Row } from "react-bootstrap";

const BrandBar = observer(() => {
  const { device } = useContext(Context);
  return (
    <Row className="d-flex flex-row">
      {device.brands.map((brand) => (
        <Card
          key={brand.id}
          border={brand.id === device.selectedBrand.id ? 'danger' : 'light'}
          onClick={() => device.setSelectedBrand(brand)}
          className="cursor-item p-2"
          style={{ width: "auto" }}
        >
          {brand.name}
        </Card>
      ))}
    </Row>
  );
});

export default BrandBar;
