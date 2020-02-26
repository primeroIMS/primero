import React, { useState, cloneElement } from "react";
import PropTypes from "prop-types";
import { Backdrop, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CloseIcon from "@material-ui/icons/Close";

import styles from "./styles.css";

const Component = ({ trigger, image }) => {
  const css = makeStyles(styles)();

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    console.log("here");
    setOpen(!open);
  };

  if (!image) return false;

  return (
    <>
      <button onClick={handleClose} type="button" className={css.button}>
        {trigger}
      </button>
      <Backdrop className={css.backdrop} open={open} onClick={handleClose}>
        <IconButton className={css.backdropClose}>
          <CloseIcon />
        </IconButton>
        <img src={image} alt="" />
      </Backdrop>
    </>
  );
};

Component.displayName = "Lightbox";

Component.propTypes = {
  image: PropTypes.string,
  trigger: PropTypes.node
};

export default Component;
