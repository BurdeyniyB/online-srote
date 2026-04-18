import { useEffect, useState } from "react";
import "../style/Index.css";
import Banners from "../components/index/Banners";
import { observer } from "mobx-react-lite";
import ProductSection from "../components/index/ProductSection";
import PopularSection from "../components/index/PopularSection";
import { fetchDevices } from "../http/deviceAPI";
import { STORE_ROUTE } from "../utils/const";

const Index = observer(() => {
  const [popular, setPopular] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [onSale, setOnSale] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    fetchDevices(null, null, null, null, "date_desc", 1, 12, null, 3).then((data) => {
      setPopular(data.rows);
    });

    fetchDevices(null, null, null, null, "date_desc", 1, 8).then((data) => {
      setNewArrivals(data.rows);
    });

    fetchDevices(null, null, null, null, "price_asc", 1, 8, null, null, null, true).then((data) => {
      setOnSale(data.rows);
    });

    try {
      const stored = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      setRecentlyViewed(stored.slice(0, 8));
    } catch (e) {}
  }, []);

  return (
    <div>
      <Banners />
      <div className="home-sections">
        <PopularSection devices={popular} viewAllLink={STORE_ROUTE} />
        <ProductSection title="New Arrivals" devices={newArrivals} viewAllLink={STORE_ROUTE} />
        <ProductSection title="On Sale" devices={onSale} viewAllLink={STORE_ROUTE} />
        <ProductSection title="Recently Viewed" devices={recentlyViewed} />
      </div>
    </div>
  );
});

export default Index;
