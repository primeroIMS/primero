// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { CircularProgress, Fade } from "@mui/material";
import PropTypes from "prop-types";

import { NAME } from "./constants";

function Component({ loadingIndicator, loading, classes }) {
  const transitionDelayStyles = {
    transitionDelay: loading ? "800ms" : "0ms"
  };

  return (
    loadingIndicator || (
      <Fade in={loading} style={transitionDelayStyles} unmountOnExit>
        <div className={classes}>
          <CircularProgress size={80} />
        </div>
      </Fade>
    )
  );
}

Component.displayName = NAME;

Component.propTypes = {
  classes: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  loadingIndicator: PropTypes.node
};

export default Component;
