import { observer } from "mobx-react-lite";
import { useContext, useEffect, useRef } from "react";
import { Context } from "../index";
import DeviceItem from "./DeviceItem";
import "../style/App.css";

const MIN_ITEM_WIDTH = 260;
const GAP = 12;

const DeviceList = observer(() => {
  const { device } = useContext(Context);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const calculate = (width) => {
      if (width === 0) return;
      const cols = Math.max(1, Math.floor((width + GAP) / (MIN_ITEM_WIDTH + GAP)));
      const rows = Math.max(3, Math.ceil(window.innerHeight / 320));
      const newLimit = cols * rows;
      if (newLimit !== device.limit) {
        device.setPage(1);
        device.setlimit(newLimit);
      }
    };

    calculate(containerRef.current.getBoundingClientRect().width);

    const ro = new ResizeObserver((entries) => {
      calculate(entries[0].contentRect.width);
    });
    ro.observe(containerRef.current);

    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="device-list-container">
      {device.devices.map((d) => (
        <DeviceItem key={d.id} device={d} />
      ))}
    </div>
  );
});

export default DeviceList;
