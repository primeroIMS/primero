// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { IconButton } from "@mui/material";
import MenuOpen from "@mui/icons-material/MenuOpen";
import PropTypes from "prop-types";

import css from "./styles.css";

const RecordFormTitle = ({ displayText, handleToggleNav, mobileDisplay }) => {
  const showMobileIcon = mobileDisplay ? (
    <IconButton onClick={handleToggleNav} data-testid="icon-button">
      <MenuOpen data-testid="menu-open" />
    </IconButton>
  ) : null;

  return (
    <>
      <div className={css.formTitle} data-testid="record-form-title">
        {showMobileIcon}
        <span className={css.formHeading}>{displayText}</span>
      </div>
    </>
  );
};

RecordFormTitle.displayName = "RecordFormTitle";

RecordFormTitle.propTypes = {
  displayText: PropTypes.string.isRequired,
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired
};

export default RecordFormTitle;
