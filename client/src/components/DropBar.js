import { observer } from "mobx-react-lite";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import "../style/DropBar.css";

const DropBar = observer(({ name, items, selectedItems, setSelectedItems, checkBox = true, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleItemClick = (item) => {
    if (checkBox) {
      setSelectedItems(item);
    } else {
      setSelectedItems(selectedItems?.id === item.id ? {} : item);
    }
  };

  const selectedCount = checkBox ? selectedItems?.length : 0;

  const renderItem = (item) => {
    const isChecked = checkBox
      ? selectedItems.some((i) => i.id === item.id)
      : selectedItems?.id === item.id;

    return (
      <div
        key={item.id}
        className={`filter-item ${isChecked ? "filter-item--checked" : ""}`}
        onClick={() => handleItemClick(item)}
      >
        <span className={`filter-checkbox ${checkBox ? "" : "filter-checkbox--radio"} ${isChecked ? "filter-checkbox--active" : ""}`}>
          {isChecked && <span className="filter-checkbox-mark">{checkBox ? "✓" : "●"}</span>}
        </span>
        <span className="filter-item-label">{item.name}</span>
      </div>
    );
  };

  return (
    <div className="filter-section">
      <button className="filter-section-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span className="filter-section-name">
          {name}
          {selectedCount > 0 && (
            <span className="filter-section-badge">+{selectedCount}</span>
          )}
        </span>
        <FaChevronDown className={`filter-section-arrow ${isOpen ? "filter-section-arrow--open" : ""}`} />
      </button>

      <div className={`filter-section-body ${isOpen ? "filter-section-body--open" : ""}`}>
        <div className="filter-items">
          {items.map(renderItem)}
        </div>
      </div>
    </div>
  );
});

export default DropBar;
