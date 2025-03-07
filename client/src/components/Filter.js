import React, { useContext } from "react";
import PriceFilter from "./PriceFilter";
import { Context } from "..";
import DropBar from "./DropBar";

const Filter = () => {
  const { device } = useContext(Context);

  const handlePriceChange = ({ min, max }) => {
    device.setMinPrice(min);
    device.setMaxPrice(max);
  };

  return (
    <div style={{ width: "100%", maxWidth: "300px" }}>
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
        selectedItems={device.selectedType} // 🔥 Масив
        setSelectedItems={(items) => device.setSelectedType(items)}
        checkBox={true}
      />

      <DropBar
        name="Brand"
        items={device.brands}
        selectedItems={device.selectedBrand} // 🔥 Масив
        setSelectedItems={(items) => device.setSelectedBrand(items)}
        checkBox={true}
      />
    </div>
  );
};

export default Filter;
