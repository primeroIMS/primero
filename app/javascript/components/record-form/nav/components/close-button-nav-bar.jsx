import { IconButton } from "@material-ui/core";
import PropTypes from "prop-types";
import CloseIcon from "@material-ui/icons/Close";

import css from "../styles.css";

const CloseButtonNavBar = ({ handleToggleNav, mobileDisplay }) => {
  if (!mobileDisplay) return false;

  return (
    <div className={css.closeButtonRecordNav}>
      <IconButton onClick={handleToggleNav} className={css.closeIconButtonRecordNav}>
        <CloseIcon />
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
