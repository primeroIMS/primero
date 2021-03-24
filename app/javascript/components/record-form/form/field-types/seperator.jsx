/* eslint-disable react/no-multi-comp, react/display-name */
import PropTypes from "prop-types";
import { FormHelperText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { SEPERATOR_NAME } from "../constants";
import styles from "../styles.css";

const useStyles = makeStyles(styles);

const Seperator = ({ helperText, label, mode }) => {
  const css = useStyles();
  const renderHelperText = () => (mode.isEdit ? <FormHelperText>{helperText}</FormHelperText> : null);

  return (
    <>
      <h4 className={css.separator}>{label}</h4>
      {renderHelperText()}
    </>
  );
};

Seperator.displayName = SEPERATOR_NAME;

Seperator.propTypes = {
  helperText: PropTypes.string,
  label: PropTypes.string,
  mode: PropTypes.object
};

export default Seperator;
