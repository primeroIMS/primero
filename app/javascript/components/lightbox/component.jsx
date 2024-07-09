// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import css from "./styles.css";

function Component({ trigger, image }) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    if (image) {
      setOpen(!open);
    }
  };

  return (
    <div>
      <button onClick={handleClose} type="button" className={css.button}>
        {trigger}
      </button>
      {image && (
        <Modal open={open} onClick={handleClose}>
          <div className={css.backdrop}>
            <IconButton size="large" className={css.backdropClose}>
              <CloseIcon />
            </IconButton>
            {open && <img src={image} alt="" />}
          </div>
        </Modal>
      )}
    </div>
  );
}

Component.displayName = "Lightbox";

Component.propTypes = {
  image: PropTypes.string,
  trigger: PropTypes.node
};

export default Component;
