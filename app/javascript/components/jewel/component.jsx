import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";
import { Brightness1 as Circle } from "@material-ui/icons";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Jewel = ({ value, isForm, isList, isError }) => {
  const css = useStyles();
  const classes = clsx(css.circleForm, css.error);

  if (isList) {
    return <Circle className={css.circleList} />;
  }

  if (isError && !isForm) {
    return (
      <>
        {value}
        <Circle className={classes} />
      </>
    );
  }

  return (
    <>
      {isForm ? (
        <>
          {value}
          {isError && <Circle className={classes} />}
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
  isError: PropTypes.bool,
  isForm: PropTypes.bool,
  isList: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool])
};

export default Jewel;
