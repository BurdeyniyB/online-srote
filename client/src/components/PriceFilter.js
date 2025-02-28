import React, { useState, useRef, useEffect } from "react";
import "../style/PriceFilter.css";

const PriceFilter = ({ min, max, onPriceChange }) => {
  const [timer, setTimer] = useState(null);
  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleMinChange = (e) => {
    const value = Math.min(parseInt(e.target.value) || min, maxPrice - 1);
    setMinPrice(value);

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = window.setTimeout(() => {
      onPriceChange({ min: value, max: maxPrice });
    }, 500);

    setTimer(newTimer);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(parseInt(e.target.value) || max, minPrice + 1);
    setMaxPrice(value);

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = window.setTimeout(() => {
      onPriceChange({ min: minPrice, max: value });
    }, 350);

    setTimer(newTimer);
  };

  // Динамічне оновлення активної лінії між повзунками
  const getRangeStyle = () => ({
    left: `${((minPrice - min) / (max - min)) * 100}%`,
    width: `${((maxPrice - minPrice) / (max - min)) * 100}%`,
  });

  return (
    <div
      ref={dropdownRef}
      className={`custom-dropdown ${isOpen ? "show" : ""}`}
    >
      <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        Price
      </button>
      {isOpen && (
        <div className="dropdown-menu p-3">
          <div className="price-filter-container">
            <div className="slider-container">
              <div className="slider-track"></div>
              <div className="slider-range" style={getRangeStyle()}></div>

              <input
                type="range"
                min={min}
                max={max}
                value={minPrice}
                onChange={handleMinChange}
                className="slider min-slider"
              />
              <input
                type="range"
                min={min}
                max={max}
                value={maxPrice}
                onChange={handleMaxChange}
                className="slider max-slider"
              />
            </div>
            <div className="input-container">
              <input
                type="number"
                value={minPrice}
                onChange={handleMinChange}
                className="price-input"
                min={min}
                max={maxPrice - 1}
              />
              <input
                type="number"
                value={maxPrice}
                onChange={handleMaxChange}
                className="price-input"
                min={minPrice + 1}
                max={max}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceFilter;
