// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import { Backdrop, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import css from "./styles.css";

const Component = ({ trigger, image }) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    if (image) {
      setOpen(!open);
    }
  };

  return (
    <>
      <button onClick={handleClose} type="button" className={css.button}>
        {trigger}
      </button>
      {image && (
        <Backdrop className={css.backdrop} open={open} onClick={handleClose}>
          <IconButton className={css.backdropClose}>
            <CloseIcon />
          </IconButton>
          {open && <img src={image} alt="" />}
        </Backdrop>
      )}
    </>
  );
};

Component.displayName = "Lightbox";

Component.propTypes = {
  image: PropTypes.string,
  trigger: PropTypes.node
};

export default Component;
