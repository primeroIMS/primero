// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import { Backdrop, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import clsx from "clsx";

import css from "../../styles.css";

const PhotoArray = ({ images = [], isGallery = false }) => {
  const [selected, setSelected] = useState({ index: 0, open: false });

  const handleToggle = index => {
    setSelected({ index, open: !selected.open });
  };

  const handleClose = index => {
    setSelected({ index, open: false });
  };

  const imageClasses = clsx({
    [css.imgGallery]: isGallery,
    [css.imgContainer]: !isGallery
  });

  const wrapperClasses = clsx({
    [css.imgGalleryWrapper]: isGallery,
    [css.imgsContainer]: !isGallery
  });

  if (!images) return null;

  const handleOnClick = index => () => handleToggle(index);

  const renderImages = () => {
    return images.map((image, index) => {
      return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div key={image} className={imageClasses} onClick={handleOnClick(index)}>
          <img src={image} alt="Record" className={css.img} />
        </div>
      );
    });
  };

  const onPrevClick = () => {
    setSelected({ index: selected.index - 1 });
  };

  const onNextClick = () => {
    setSelected({ index: selected.index + 1 });
  };

  const prevButton = isGallery && (
    <IconButton onClick={onPrevClick} disabled={selected.index === 0}>
      <NavigateBeforeIcon />
    </IconButton>
  );

  const nextButton = isGallery && (
    <IconButton onClick={onNextClick} disabled={selected.index + 1 === images.length}>
      <NavigateNextIcon />
    </IconButton>
  );

  return (
    <>
      <div className={wrapperClasses}>
        {prevButton}
        {isGallery ? (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
          <div className={css.imgCurrent} onClick={handleOnClick(selected.index)}>
            <img src={images[selected.index]} alt="" />
          </div>
        ) : (
          renderImages()
        )}
        {nextButton}
      </div>
      <Backdrop className={css.backdrop} open={selected.open} onClick={() => handleClose(selected.index)}>
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
  images: PropTypes.array,
  isGallery: PropTypes.bool
};

export default PhotoArray;
