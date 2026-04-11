import { useContext, useEffect, useRef, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchOneDevice } from "../http/deviceAPI";
import { addToBasket } from "../http/basketAPI";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import { FaShoppingCart, FaChevronDown } from "react-icons/fa";
import "../style/DevicePage.css";

const EXCLUDED_SPEC_KEYS = new Set([
  "url", "scraped_at", "description", "features_text", "images_text",
  "images", "features", "ranks", "technical_details",
]);

function getSpecEntries(specs) {
  if (!specs) return [];
  return Object.entries(specs)
    .filter(([key]) => {
      const cleanKey = key.split("\n")[0].trim();
      return !EXCLUDED_SPEC_KEYS.has(cleanKey) && !cleanKey.startsWith("rank_") && !cleanKey.startsWith("images");
    })
    .map(([key, value]) => {
      const cleanKey = key.split("\n")[0].trim().replace(/^tech_/, "").replace(/_/g, " ");
      const cleanValue = String(value).replace(/^[\s\u200e\u200f]+/, "").trim();
      return [cleanKey, cleanValue];
    })
    .filter(([, value]) => value && value !== "undefined");
}

function getDescription(device) {
  if (device.specs?.description) {
    const raw = device.specs.description
      .replace(/Product description\s*/i, "")
      .replace(/\s{2,}/g, " ")
      .trim();
    const firstParagraph = raw.split(/\n{2,}/)[0].trim();
    return firstParagraph.length > 400 ? firstParagraph.slice(0, 400) + "…" : firstParagraph;
  }
  return null;
}

const DevicePage = observer(() => {
  const { user } = useContext(Context);
  const [device, setDevice] = useState({ info: [] });
  const [activeIndex, setActiveIndex] = useState(0);
  const [specsExpanded, setSpecsExpanded] = useState(false);
  const [additionalOpen, setAdditionalOpen] = useState(false);
  const [galleryHeight, setGalleryHeight] = useState(null);
  const galleryRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    fetchOneDevice(id).then((data) => {
      setDevice(data);
      setActiveIndex(0);
      setSpecsExpanded(false);
      setAdditionalOpen(false);
    });
  }, [id]);

  useEffect(() => {
    if (!galleryRef.current) return;
    const el = galleryRef.current;
    const observer = new ResizeObserver(() => {
      setGalleryHeight(el.offsetHeight);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const addDeviceToBasket = async () => {
    try {
      await addToBasket({ userId: user.user.id, deviceId: device.id });
    } catch (error) {
      console.error("Failed to add product to basket:", error);
    }
  };

  const images = Array.isArray(device.imageUrls) && device.imageUrls.length
    ? device.imageUrls
    : device.img
    ? [device.img]
    : [];

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  const specEntries = getSpecEntries(device.specs);
  const description = getDescription(device);

  const isClamped = !specsExpanded && galleryHeight !== null;

  return (
    <Container className="device-page">
      <h1 className="page-product-title">{device.name}</h1>

      <div className="device-layout">
        {/* Left: gallery */}
        <div className="device-gallery" ref={galleryRef}>
          <div className="gallery-main">
            {images[activeIndex] && (
              <img src={images[activeIndex]} alt={device.name} className="main-image" />
            )}
            {images.length > 1 && (
              <>
                <button className="gallery-arrow gallery-arrow--left" onClick={prev}>&#8249;</button>
                <button className="gallery-arrow gallery-arrow--right" onClick={next}>&#8250;</button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="gallery-thumbnails">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className={`thumbnail${activeIndex === i ? " active" : ""}`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: info + characteristics */}
        <div
          className={`device-info${isClamped ? " device-info--clamped" : ""}`}
          style={isClamped ? { maxHeight: galleryHeight } : {}}
        >
          {description && (
            <div className="device-description-block">
              <p className="block-label">Description</p>
              <p className="device-description">{description}</p>
            </div>
          )}

          <div className="device-price-row">
            <span className="device-price">{device.price} $</span>
            <Button
              variant="outline-dark"
              className="add-to-basket"
              onClick={addDeviceToBasket}
            >
              <FaShoppingCart size={18} />
            </Button>
          </div>

          {specEntries.length > 0 && (
            <div className="device-characteristics">
              <h3>Characteristics</h3>
              <table className="characteristics-table">
                <tbody>
                  {specEntries.map(([key, value], i) => (
                    <tr key={i} className={i % 2 === 0 ? "row-even" : "row-odd"}>
                      <td className="spec-key">{key}</td>
                      <td className="spec-value">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {device.info && device.info.length > 0 && (
            <div className="device-characteristics device-characteristics--collapsible">
              <button
                className="characteristics-toggle"
                onClick={() => setAdditionalOpen((o) => !o)}
              >
                <span>Additional info</span>
                <FaChevronDown className={`toggle-icon${additionalOpen ? " toggle-icon--open" : ""}`} />
              </button>
              {additionalOpen && (
                <table className="characteristics-table">
                  <tbody>
                    {device.info.map((info, i) => (
                      <tr key={info.id} className={i % 2 === 0 ? "row-even" : "row-odd"}>
                        <td className="spec-key">{info.title}</td>
                        <td className="spec-value">{info.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {isClamped && (
            <button className="see-more-btn" onClick={() => setSpecsExpanded(true)}>
              See more
            </button>
          )}
        </div>
      </div>
    </Container>
  );
});

export default DevicePage;
