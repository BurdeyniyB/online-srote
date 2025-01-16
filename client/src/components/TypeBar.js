import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "..";
import { ListGroup } from "react-bootstrap";
import "../style/App.css";

const TypeBar = observer(() => {
  const { device } = useContext(Context);

  return (
    <div>
      <ListGroup>
        {device.types.map((type) => (
          <ListGroup.Item
            className="cursor-item"
            active={type.id === device.selectedType.id}
            onClick={() => device.setSelectedType(type)}
            key={type.id}
          >
            {type.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
});

export default TypeBar;
