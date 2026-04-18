import { useNavigate } from "react-router-dom";
import DeviceItem from "../DeviceItem";

const PopularSection = ({ devices, viewAllLink }) => {
  const navigate = useNavigate();

  if (!devices || devices.length === 0) return null;

  return (
    <div className="popular-section">
      <div className="popular-section-header">
        <div>
          <h2 className="popular-section-title">Popular Products</h2>
          <p className="popular-section-subtitle">Top picks loved by our customers</p>
        </div>
        {viewAllLink && (
          <button className="popular-section-link" onClick={() => navigate(viewAllLink)}>
            View All →
          </button>
        )}
      </div>
      <div className="popular-section-grid">
        {devices.map((d) => (
          <DeviceItem key={d.id} device={d} />
        ))}
      </div>
    </div>
  );
};

export default PopularSection;
