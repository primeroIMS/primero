// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import { Backdrop, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { cx } from "@emotion/css";

import css from "../../styles.css";
import { AssetJwt } from "../../../../asset-jwt";

function PhotoArray({ images = [], isGallery = false }) {
  const [selected, setSelected] = useState({ index: 0, open: false });

  const handleToggle = index => {
    setSelected({ index, open: !selected.open });
  };

  const handleClose = index => {
    setSelected({ index, open: false });
  };

  const imageClasses = cx({
    [css.imgGallery]: isGallery,
    [css.imgContainer]: !isGallery
  });

  const wrapperClasses = cx({
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
          <AssetJwt src={image} alt="Record" className={css.img} />
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
    <IconButton size="large" onClick={onPrevClick} disabled={selected.index === 0}>
      <NavigateBeforeIcon />
    </IconButton>
  );

  const nextButton = isGallery && (
    <IconButton size="large" onClick={onNextClick} disabled={selected.index + 1 === images.length}>
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
            <AssetJwt src={images[selected.index]} alt="" />
          </div>
        ) : (
          renderImages()
        )}
        {nextButton}
      </div>
      <Backdrop className={css.backdrop} open={selected.open} onClick={() => handleClose(selected.index)}>
        <IconButton size="large" className={css.backdropClose}>
          <CloseIcon />
        </IconButton>
        <AssetJwt src={images[selected.index]} alt="" />
      </Backdrop>
    </>
  );
}

PhotoArray.displayName = "PhotoArray";

PhotoArray.propTypes = {
  images: PropTypes.array,
  isGallery: PropTypes.bool
};

export default PhotoArray;
