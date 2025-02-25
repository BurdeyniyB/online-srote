import React, { useContext, useEffect } from "react"
import "../../style/Products.css";
import DeviceList from "../../components/DeviceList";
import { observer } from "mobx-react-lite";
import { fetchBrands, fetchDevices, fetchTypes } from "../../http/deviceAPI";
import { Context } from "../..";

const Products = observer(() => {
    const { device } = useContext(Context);
  
    useEffect(() => {
      fetchTypes().then((data) => device.setTypes(data));
      fetchBrands().then((data) => device.setBrands(data));
      fetchDevices(null, null, 1, 8, null).then((data) => {
        device.setDevices(data.rows);
        device.setTotalCount(data.count);
      });
    }, []);
  
    return (
      <div className="products-block">
        <DeviceList />
      </div>
    );
  });
  
  export default Products;