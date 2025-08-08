import { RestartAlt, RotateLeft, RotateRight, ZoomIn, ZoomOut } from "@mui/icons-material";
import { useControls, useTransformComponent, useTransformEffect } from "react-zoom-pan-pinch";
import { useState } from "react";
import PropTypes from "prop-types";

import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../../../action-button";

import css from "./styles.css";

function ImageViewerControls({ handleRotationChange }) {
  const [imgState, setImgState] = useState({
    positionX: 0,
    positionY: 0,
    scale: 1
  });

  useTransformEffect(({ state }) => {
    setImgState({
      positionX: state.positionX,
      positionY: state.positionY,
      scale: state.scale
    });
  });

  const { zoomIn, zoomOut, resetTransform, setTransform } = useControls();

  const transformedComponent = useTransformComponent(({ state }) => {
    return <span className="ml-auto text-sm text-gray-600">Zoom: {(state.scale * 100).toFixed(0)}%</span>;
  });

  const { positionX, positionY, scale } = imgState;

  const rotateLeft = () => {
    handleRotationChange(r => r - 90);
    setTransform(positionX, positionY, scale, 200, "easeOut");
  };

  const rotateRight = () => {
    handleRotationChange(r => r + 90);
    setTransform(positionX, positionY, scale, 200, "easeOut");
  };

  const resetAll = () => {
    resetTransform();
    handleRotationChange(0);
  };

  return (
    <div className={css.imgControls}>
      <ActionButton type={ACTION_BUTTON_TYPES.icon} icon={<ZoomOut />} onClick={() => zoomOut(0.2)} />
      <ActionButton type={ACTION_BUTTON_TYPES.icon} icon={<ZoomIn />} onClick={() => zoomIn(0.2)} />
      <ActionButton type={ACTION_BUTTON_TYPES.icon} icon={<RotateLeft />} onClick={rotateLeft} />
      <ActionButton type={ACTION_BUTTON_TYPES.icon} icon={<RotateRight />} onClick={rotateRight} />
      <ActionButton type={ACTION_BUTTON_TYPES.icon} icon={<RestartAlt />} onClick={resetAll} />
      {transformedComponent}
    </div>
  );
}

ImageViewerControls.displayName = "ImageViewerControls";

ImageViewerControls.propTypes = {
  handleRotationChange: PropTypes.func.isRequired
};

export default ImageViewerControls;
