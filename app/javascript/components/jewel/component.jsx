import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";
import { Brightness1 as Circle } from "@material-ui/icons";

import styles from "./styles.css";

const Jewel = ({ value, isForm, isList }) => {
  const css = makeStyles(styles)();

  if (isList) {
    return <Circle className={css.circleList} />;
  }

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
  isList: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default Jewel;
