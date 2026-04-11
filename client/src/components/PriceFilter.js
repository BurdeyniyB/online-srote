import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import "../style/PriceFilter.css";

const PriceFilter = ({ min, max, onPriceChange }) => {
  const [timer, setTimer] = useState(null);
  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);
  const [isOpen, setIsOpen] = useState(false);

  const triggerChange = (newMin, newMax) => {
    if (timer) clearTimeout(timer);
    const t = window.setTimeout(() => onPriceChange({ min: newMin, max: newMax }), 400);
    setTimer(t);
  };

  const handleMinChange = (e) => {
    const value = Math.min(parseInt(e.target.value) || min, maxPrice - 1);
    setMinPrice(value);
    triggerChange(value, maxPrice);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(parseInt(e.target.value) || max, minPrice + 1);
    setMaxPrice(value);
    triggerChange(minPrice, value);
  };

  const getRangeStyle = () => ({
    left: `${((minPrice - min) / (max - min)) * 100}%`,
    width: `${((maxPrice - minPrice) / (max - min)) * 100}%`,
  });

  return (
    <div className="filter-section">
      <button className="filter-section-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span className="filter-section-name">Price</span>
        <FaChevronDown className={`filter-section-arrow ${isOpen ? "filter-section-arrow--open" : ""}`} />
      </button>

      <div className={`filter-section-body ${isOpen ? "filter-section-body--open" : ""}`}>
        <div className="price-inputs">
          <div className="price-input-wrap">
            <label className="price-input-label">from</label>
            <input
              type="number"
              value={minPrice}
              onChange={handleMinChange}
              className="price-input"
              min={min}
              max={maxPrice - 1}
            />
          </div>
          <div className="price-input-sep">—</div>
          <div className="price-input-wrap">
            <label className="price-input-label">to</label>
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

        <div className="slider-container">
          <div className="slider-track" />
          <div className="slider-range" style={getRangeStyle()} />
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
      </div>
    </div>
  );
};

export default PriceFilter;
