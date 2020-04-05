import React, { useState } from "react";
import PropTypes from "prop-types";
import { Backdrop, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CloseIcon from "@material-ui/icons/Close";

import styles from "../../styles.css";

const PhotoArray = ({ images }) => {
  const css = makeStyles(styles)();
  const [selected, setSelected] = useState({ index: 0, open: false });

  const handleToggle = index => {
    setSelected({ index, open: !selected.open });
  };

  const handleClose = index => {
    setSelected({ index, open: false });
  };

  if (!images) return null;

  const renderImages = images.map((image, index) => (
    <div
      key={image}
      className={css.imgContainer}
      onClick={() => handleToggle(index)}
    >
      <img src={image} alt="Record" className={css.img} />
    </div>
  ));

  return (
    <>
      <div className={css.imgsContainer}>{renderImages}</div>
      <Backdrop
        className={css.backdrop}
        open={selected.open}
        onClick={handleClose}
      >
        <IconButton className={css.backdropClose}>
          <CloseIcon />
        </IconButton>
        <img src={images[selected.index]} alt="" />
      </Backdrop>
    </>
  );
};

PhotoArray.displayName = "PhotoArray";

PhotoArray.propTypes = {
  images: PropTypes.array
};

export default PhotoArray;
