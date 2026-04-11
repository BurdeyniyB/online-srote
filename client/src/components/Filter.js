import { useContext } from "react";
import PriceFilter from "./PriceFilter";
import { Context } from "..";
import DropBar from "./DropBar";
import { FaSlidersH } from "react-icons/fa";
import "../style/Filter.css";

const Filter = () => {
  const { device } = useContext(Context);

  const handlePriceChange = ({ min, max }) => {
    device.setMinPrice(min);
    device.setMaxPrice(max);
  };

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
