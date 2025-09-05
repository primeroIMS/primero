import { RestartAlt, RotateLeft, RotateRight, ZoomIn, ZoomOut } from "@mui/icons-material";
import PropTypes from "prop-types";

import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../../../action-button";

import css from "./styles.css";

function ImageViewerControls({ handleRotationChange, zoomistRef, currentScale }) {
  const rotateLeft = () => {
    handleRotationChange(r => r - 90);
  };

  const rotateRight = () => {
    handleRotationChange(r => r + 90);
  };

  const resetAll = () => {
    if (zoomistRef.current) {
      zoomistRef.current.reset();
    }
  };

  const zoomIn = step => {
    if (zoomistRef.current) {
      zoomistRef.current.zoom(step);
    }
  };

  const zoomOut = step => {
    if (zoomistRef.current) {
      zoomistRef.current.zoom(-step);
    }
  };

  return (
    <div className={css.imgControls}>
      <ActionButton type={ACTION_BUTTON_TYPES.icon} icon={<ZoomOut />} onClick={() => zoomOut(0.2)} />
      <ActionButton type={ACTION_BUTTON_TYPES.icon} icon={<ZoomIn />} onClick={() => zoomIn(0.2)} />
      <ActionButton type={ACTION_BUTTON_TYPES.icon} icon={<RotateLeft />} onClick={rotateLeft} />
      <ActionButton type={ACTION_BUTTON_TYPES.icon} icon={<RotateRight />} onClick={rotateRight} />
      <ActionButton type={ACTION_BUTTON_TYPES.icon} icon={<RestartAlt />} onClick={resetAll} />
      <span className="ml-auto text-sm text-gray-600">Zoom: {(currentScale * 100).toFixed(0)}%</span>
    </div>
  );
}

ImageViewerControls.displayName = "ImageViewerControls";

ImageViewerControls.propTypes = {
  currentScale: PropTypes.number.isRequired,
  handleRotationChange: PropTypes.func.isRequired,
  zoomistRef: PropTypes.object.isRequired
};

export default ImageViewerControls;
