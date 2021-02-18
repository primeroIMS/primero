/* eslint-disable react/no-multi-comp, react/display-name */
import PropTypes from "prop-types";
import { FormHelperText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { SEPERATOR_NAME } from "../constants";
import styles from "../styles.css";

const Seperator = ({ helperText, label, mode }) => {
  const css = makeStyles(styles)();
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
  mode: PropTypes.string
};

export default Seperator;
