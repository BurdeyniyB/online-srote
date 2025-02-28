import { observer } from "mobx-react-lite";
import React, { useState, useRef, useEffect } from "react";
import "../style/App.css";
import "../style/DropBar.css";

const DropBar = observer(({ name, items, selectedItems, setSelectedItems, checkBox = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleItemClick = (item) => {
    if (checkBox) {
      setSelectedItems(item)
    } else {
      // Одиночний вибір
      setSelectedItems(selectedItems?.id === item.id ? {} : item);
    }
  };

  const renderItem = (item) => (
    <div key={item.id} className="dropdown-item" onClick={() => handleItemClick(item)}>
      {checkBox ? (
        <input
          type="checkbox"
          checked={selectedItems.some((i) => i.id === item.id)}
          readOnly
        />
      ) : (
        <input type="radio" checked={selectedItems?.id === item.id} readOnly />
      )}
      <span>{item.name}</span>
    </div>
  );

  return (
    <div ref={dropdownRef} className={`custom-dropdown ${isOpen ? "show" : ""}`}>
      <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        {name} {/* 🔥 Завжди показуємо фіксовану назву */}
      </button>
      {isOpen && <div className="dropdown-menu">{items.map(renderItem)}</div>}
    </div>
  );
});

export default DropBar;
