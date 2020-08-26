import React, { useState } from "react";
import PropTypes from "prop-types";
import { Backdrop, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

import { useI18n } from "../i18n";

import styles from "./styles.css";

const Component = ({ trigger, image }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    if (image) {
      setOpen(!open);
    }
  };

  return (
    <>
      <button aria-label={i18n.t("buttons.close")} onClick={handleClose} type="button" className={css.button}>
        {trigger}
      </button>
      {image && (
        <Backdrop className={css.backdrop} open={open} onClick={handleClose}>
          <IconButton aria-label={i18n.t("buttons.close")} className={css.backdropClose}>
            <CloseIcon />
          </IconButton>
          <img src={image} alt="" />
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
