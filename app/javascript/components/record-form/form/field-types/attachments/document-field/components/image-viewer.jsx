import { useState, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Zoomist from "zoomist";
import clsx from "clsx";
import { debounce } from "lodash";

import { AssetJwt } from "../../../../../../asset-jwt";

import ImageViewerControls from "./image-viewer-controls";
import css from "./styles.css";

function ImageViewer({ src, alt, mobileDisplay }) {
  const [rotation, setRotation] = useState(0);
  const [currentScale, setCurrentScale] = useState(1);
  const zoomistRef = useRef(null);
  const zoomistContainer = useRef(null);

  const handleRotationChange = useCallback(newRotation => {
    setRotation(newRotation);
  }, []);

  useEffect(() => {
    zoomistRef.current = new Zoomist(zoomistContainer.current, {
      maxScale: 4,
      bounds: true,
      on: {
        zoom: (_, scale) => {
          debounce(() => {
            setCurrentScale(scale);
          }, 100)();
        },
        reset: () => {
          handleRotationChange(0);
          setCurrentScale(1);
        }
      }
    });

    return () => {
      zoomistRef.current.destroy();
    };
  }, []);

  const zoomistClasses = {
    container: clsx("zoomist-container", css.zoomistContainer),
    wrapper: clsx("zoomist-wrapper", css.zoomistWrapper),
    image: clsx("zoomist-image", css.zoomistImage)
  };

  return (
    <div className={css.imgViewerContainer}>
      <ImageViewerControls
        handleRotationChange={handleRotationChange}
        zoomistRef={zoomistRef}
        currentScale={currentScale}
      />
      <div className={zoomistClasses.container} ref={zoomistContainer}>
        <div className={zoomistClasses.wrapper}>
          <div className={zoomistClasses.image}>
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
          </div>
        </div>
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
