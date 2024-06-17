// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { cx } from "@emotion/css"
import { Brightness1 as Circle } from "@mui/icons-material";

import css from "./styles.css";

function Jewel({ value, isForm, isList, isError }) {
  const classes = cx(css.circleForm, css.error);

  if (isList) {
    return <Circle className={css.circleList} data-testid="jewel" />;
  }

  if (isError && !isForm) {
    return (
      <div data-testid="jewel-error">
        {value}
        <Circle className={classes} />
      </div>
    );
  }

  return (
    <>
      {isForm ? (
        <>
          {value}
          {isError && <Circle className={classes} />}
          <Circle className={css.circleForm} data-testid="error" />
        </>
      ) : (
        <div className={css.root} data-testid="jewel">
          <span>{value}</span>
          <Circle className={css.circle} />
        </div>
      )}
    </>
  );
}

Jewel.displayName = "Jewel";

Jewel.propTypes = {
  isError: PropTypes.bool,
  isForm: PropTypes.bool,
  isList: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool])
};

export default Jewel;
