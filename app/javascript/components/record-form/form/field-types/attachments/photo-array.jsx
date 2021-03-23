import { useState } from "react";
import PropTypes from "prop-types";
import { Backdrop, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

import styles from "../../styles.css";

const useStyles = makeStyles(styles);

const PhotoArray = ({ images }) => {
  const css = useStyles();
  const [selected, setSelected] = useState({ index: 0, open: false });

  const handleToggle = index => {
    setSelected({ index, open: !selected.open });
  };

  const handleClose = index => {
    setSelected({ index, open: false });
  };

  if (!images) return null;

  const renderImages = () => {
    const handleOnClick = index => () => handleToggle(index);

    return images.map((image, index) => {
      return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div key={image} className={css.imgContainer} onClick={handleOnClick(index)}>
          <img src={image} alt="Record" className={css.img} />
        </div>
      );
    });
  };

  return (
    <>
      <div className={css.imgsContainer}>{renderImages()}</div>
      <Backdrop className={css.backdrop} open={selected.open} onClick={handleClose}>
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
