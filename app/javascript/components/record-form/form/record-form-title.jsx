import { IconButton } from "@material-ui/core";
import MenuOpen from "@material-ui/icons/MenuOpen";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const RecordFormTitle = ({ displayText, handleToggleNav, mobileDisplay }) => {
  const css = useStyles();

  const showMobileIcon = mobileDisplay ? (
    <IconButton onClick={handleToggleNav}>
      <MenuOpen />
    </IconButton>
  ) : null;

  return (
    <div className={css.formTitle}>
      {showMobileIcon}
      <span className={css.formHeading}>{displayText}</span>
    </div>
  );
};

RecordFormTitle.displayName = "RecordFormTitle";

RecordFormTitle.propTypes = {
  displayText: PropTypes.string.isRequired,
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired
};

export default RecordFormTitle;
