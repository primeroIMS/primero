import { useState } from "react";
import PropTypes from "prop-types";
import { Backdrop, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({ trigger, image }) => {
  const css = useStyles();

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
