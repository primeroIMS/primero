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
          <Circle className={css.CircleForm} />
        </>
      ) : (
        <div className={css.Root}>
          <span>{value}</span>
          <Circle className={css.Circle} />
        </div>
      )}
    </>
  );
};

Jewel.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isForm: PropTypes.bool
};

export default Jewel;
