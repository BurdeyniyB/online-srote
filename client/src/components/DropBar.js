import { observer } from "mobx-react-lite";
import React, { useState, useRef, useEffect } from "react";
import "../style/App.css";
import "../style/DropBar.css";

const DropBar = observer(({ name, items, selectedItem, setSelectedItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Закриття при кліку поза випадаючим списком
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`custom-dropdown ${isOpen ? "show" : ""}`}>
      <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        {selectedItem?.name || `${name}`}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {items.map((item) => (
            <div
              key={item.id}
              className="dropdown-item"
              onClick={() => {
                setSelectedItem(item);
                setIsOpen(false);
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default DropBar;
