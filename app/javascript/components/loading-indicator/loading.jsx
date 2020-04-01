import { CircularProgress, Fade } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";

const Component = ({ loadingIndicator, loading, classes }) =>
  loadingIndicator || (
    <Fade
      in={loading}
      style={{
        transitionDelay: loading ? "800ms" : "0ms"
      }}
      unmountOnExit
    >
      <div className={classes}>
        <CircularProgress size={80} />
      </div>
    </Fade>
  );

Component.propTypes = {
  classes: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  loadingIndicator: PropTypes.node
};

export default Component;
