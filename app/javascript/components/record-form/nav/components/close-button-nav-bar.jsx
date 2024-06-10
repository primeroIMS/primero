// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { IconButton } from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";

import css from "../styles.css";

const CloseButtonNavBar = ({ handleToggleNav, mobileDisplay }) => {
  if (!mobileDisplay) return false;

  return (
    <div className={css.closeButtonRecordNav}>
      <IconButton size="large" onClick={handleToggleNav} className={css.closeIconButtonRecordNav}>
        <CloseIcon data-testid="close-icon" />
      </IconButton>
    </div>
  );
};

CloseButtonNavBar.displayName = "CloseButtonNavBar";

CloseButtonNavBar.propTypes = {
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired
};

export default CloseButtonNavBar;
