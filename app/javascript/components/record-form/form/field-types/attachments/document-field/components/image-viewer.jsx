import { useState, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import PropTypes from "prop-types";

import { AssetJwt } from "../../../../../../asset-jwt";

import ImageViewerControls from "./image-viewer-controls";
import css from "./styles.css";

function ImageViewer({ src, alt, mobileDisplay }) {
  const [rotation, setRotation] = useState(0);

  const handleRotationChange = useCallback(newRotation => {
    setRotation(newRotation);
  }, []);

  return (
    <div className={css.imgViewerContainer}>
      <div className={css.imgViewer}>
        <TransformWrapper
          limitToBounds
          initialPositionY={0}
          minScale={0.5}
          maxScale={4}
          centerOnInit
          doubleClick={{ disabled: true }}
        >
          <ImageViewerControls handleRotationChange={handleRotationChange} />
          <TransformComponent
            wrapperStyle={{
              height: "100%",
              width: "100%"
            }}
            contentStyle={{ width: "100%", height: "100%" }}
          >
            <AssetJwt
              asDiv
              src={src}
              alt={alt}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: "transform 0.3s ease",
                userSelect: "none",
                height: mobileDisplay ? "auto" : "100%"
              }}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}

ImageViewer.displayName = "ImageViewer";

ImageViewer.propTypes = {
  alt: PropTypes.string,
  mobileDisplay: PropTypes.bool,
  src: PropTypes.string.isRequired
};

export default ImageViewer;
