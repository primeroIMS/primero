import React from "react";
import PropTypes from "prop-types";
import { CircularProgress, Fade, makeStyles } from "@material-ui/core";
import styles from "./styles.css";

const LoadingIndicator = ({ loading }) => {
  const css = makeStyles(styles)();

  if (loading) {
    return (
      <Fade
        in={loading}
        style={{
          transitionDelay: loading ? "800ms" : "0ms"
        }}
        unmountOnExit
      >
        <div className={css.loading}>
          <CircularProgress />
        </div>
      </Fade>
    );
  }

  return null;
};

LoadingIndicator.propTypes = {
  loading: PropTypes.bool
};

export default LoadingIndicator;
