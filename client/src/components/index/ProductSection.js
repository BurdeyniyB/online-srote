import { useNavigate } from "react-router-dom";
import DeviceItem from "../DeviceItem";

const ProductSection = ({ title, devices, viewAllLink }) => {
  const navigate = useNavigate();

  if (!devices || devices.length === 0) return null;

  return (
    <div className="product-section">
      <div className="product-section-header">
        <h2 className="product-section-title">{title}</h2>
        {viewAllLink && (
          <button className="product-section-link" onClick={() => navigate(viewAllLink)}>
            View All →
          </button>
        )}
      </div>
      <div className="product-section-scroll">
        {devices.map((d) => (
          <div key={d.id} className="product-section-item">
            <DeviceItem device={d} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
