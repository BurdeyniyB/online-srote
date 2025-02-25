import React, { useContext, useEffect } from "react"
import "../style/Index.css";
import Banners from "../components/index/Banners";
import { observer } from "mobx-react-lite";
import Products from "../components/index/Products";

const Index = observer(() => {

  return (
    <div>
      <Banners />
      <Products />
    </div>
  );
});

export default Index;
