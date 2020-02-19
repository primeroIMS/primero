import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

import { NAME } from "./constants";
import styles from "./styles.css";

const DisplayData = ({ label, value }) => {
  const css = makeStyles(styles)();

  return (
    <>
      <p className={css.label}>{label}</p>
      <p>{value || "--"}</p>
    </>
  );
};

DisplayData.displayName = NAME;

DisplayData.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default DisplayData;
