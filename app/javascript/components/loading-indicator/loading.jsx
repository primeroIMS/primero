import { CircularProgress, Fade } from "@material-ui/core";
import PropTypes from "prop-types";

import { NAME } from "./constants";

const Component = ({ loadingIndicator, loading, classes }) => {
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
};

Component.displayName = NAME;

Component.propTypes = {
  classes: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  loadingIndicator: PropTypes.node
};

export default Component;
