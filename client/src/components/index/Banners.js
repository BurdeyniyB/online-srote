import React from "react";
import { Button } from "react-bootstrap";
import "../../style/Index.css";

const Banners = () => {
  return (
    <div>
      <div className="banner-container">
        <div className="banner-text">
          <h6>Pro.Beyond.</h6>
          <h1>
            IPhone 14 <div className="text-pro">PRO</div>
          </h1>
          <p>Created to change everything for the better. For everyone</p>
          <Button>Shop Now</Button>
        </div>
        <div className="banner-image">
          <img src="/images/Banner/Iphone.png" alt="iPhone 14 PRO" />
        </div>
      </div>
      <div className="products-container">
        <div className="left-products">
          <div className="product-block higher">
            <div className="product-block playstation">
              <img src="/images/Banner/Playstation.png" alt="Playstation" />
              <div className="text-content">
                <h1>Playstation 5</h1>
                <p>
                  Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O
                  will redefine your PlayStation experience.
                </p>
              </div>
            </div>
          </div>
          <div className="product-block smaller">
            <div className="product-block airpods">
              <img src="/images/Banner/AirPodsMax.png" alt="Apple AirPods" />
              <div className="text-content">
                <h1>
                  Apple AirPods <div className="text-pro">Max</div>
                </h1>
                <p>Computational audio. Listen, it's powerful.</p>
              </div>
            </div>

            <div className="product-block vision-pro">
              <img
                src="/images/Banner/AppleVision.png"
                alt="Apple Vision Pro"
              />
              <div className="text-content">
                <h1>
                  Apple Vision <div className="text-pro">Pro</div>
                </h1>
                <p>An immersive way to experience entertainment.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="right-product">
          <div className="text-content">
            <h1>Macbook Air</h1>
            <p>
              The new 15‑inch MacBook Air makes room for more of what you love
              with a spacious Liquid Retina display.
            </p>
            <Button>Shop Now</Button>
          </div>
          <img src="/images/Banner/MacbookAir.png" alt="Macbook Air" />
        </div>
      </div>
    </div>
  );
};

export default Banners;
