import { useContext, useState } from "react";
import PriceFilter from "./PriceFilter";
import { Context } from "..";
import DropBar from "./DropBar";
import { FaSlidersH, FaChevronDown } from "react-icons/fa";
import "../style/Filter.css";

const RATING_OPTIONS = [
  { id: 4, name: "4★ & up" },
  { id: 3, name: "3★ & up" },
  { id: 2, name: "2★ & up" },
  { id: 1, name: "1★ & up" },
];

const Filter = () => {
  const { device } = useContext(Context);
  const [statusOpen, setStatusOpen] = useState(false);

  const handlePriceChange = ({ min, max }) => {
    device.setMinPrice(min);
    device.setMaxPrice(max);
  };

  const selectedRating = RATING_OPTIONS.find((o) => o.id === device.minRating) ?? {};

  const statusBadge = (device.inStockOnly ? 1 : 0) + (device.onSaleOnly ? 1 : 0);

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <FaSlidersH className="filter-header-icon" />
        <span>Filters</span>
      </div>

      <PriceFilter min={0} max={50000} onPriceChange={handlePriceChange} />

      <DropBar
        name="Sort by"
        items={device.sortBy}
        selectedItems={device.selectedSortBy}
        setSelectedItems={(items) => device.setSelectedSortBy(items)}
        checkBox={false}
      />

      <DropBar
        name="Rating"
        items={RATING_OPTIONS}
        selectedItems={selectedRating}
        setSelectedItems={(item) => device.setMinRating(selectedRating?.id === item.id ? null : item.id)}
        checkBox={false}
      />

      <div className="filter-section">
        <button className="filter-section-toggle" onClick={() => setStatusOpen(!statusOpen)}>
          <span className="filter-section-name">
            Status
            {statusBadge > 0 && <span className="filter-section-badge">+{statusBadge}</span>}
          </span>
          <FaChevronDown className={`filter-section-arrow ${statusOpen ? "filter-section-arrow--open" : ""}`} />
        </button>
        <div className={`filter-section-body ${statusOpen ? "filter-section-body--open" : ""}`}>
          <div className="filter-items">
            <div
              className={`filter-item ${device.inStockOnly ? "filter-item--checked" : ""}`}
              onClick={() => device.setInStockOnly(!device.inStockOnly)}
            >
              <span className={`filter-checkbox ${device.inStockOnly ? "filter-checkbox--active" : ""}`}>
                {device.inStockOnly && <span className="filter-checkbox-mark">✓</span>}
              </span>
              <span className="filter-item-label">In Stock</span>
            </div>
            <div
              className={`filter-item ${device.onSaleOnly ? "filter-item--checked" : ""}`}
              onClick={() => device.setOnSaleOnly(!device.onSaleOnly)}
            >
              <span className={`filter-checkbox ${device.onSaleOnly ? "filter-checkbox--active" : ""}`}>
                {device.onSaleOnly && <span className="filter-checkbox-mark">✓</span>}
              </span>
              <span className="filter-item-label">On Sale</span>
            </div>
          </div>
        </div>
      </div>

      <DropBar
        name="Type"
        items={device.types}
        selectedItems={device.selectedType}
        setSelectedItems={(items) => device.setSelectedType(items)}
        checkBox={true}
      />
      <DropBar
        name="Brand"
        items={device.brands}
        selectedItems={device.selectedBrand}
        setSelectedItems={(items) => device.setSelectedBrand(items)}
        checkBox={true}
      />
    </div>
  );
};

export default Filter;
