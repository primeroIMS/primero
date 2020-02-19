import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";
import { Brightness1 as Circle } from "@material-ui/icons";

import styles from "./styles.css";

const Jewel = ({ value, isForm }) => {
  const css = makeStyles(styles)();

  return (
    <>
      {isForm ? (
        <>
          {value}
          <Circle className={css.circleForm} />
        </>
      ) : (
        <div className={css.root}>
          <span>{value}</span>
          <Circle className={css.circle} />
        </div>
      )}
    </>
  );
};

Jewel.displayName = "Jewel";

Jewel.propTypes = {
  isForm: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default Jewel;
