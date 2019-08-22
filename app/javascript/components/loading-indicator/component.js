import React from "react";
import PropTypes from "prop-types";
import { CircularProgress, Fade, withStyles, Button } from "@material-ui/core";
import { ListIcon } from "components/list-icon";
import { withI18n } from "components/i18n";
import styles from "./styles.css";

class LoadingIndicator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false
    };

    this.handleTryAgain = this.handleTryAgain.bind(this);
    this.window = window;
  }

  componentDidCatch() {
    this.setState({ error: true });
  }

  handleTryAgain() {
    this.window.location.reload();
  }

  render() {
    const { error } = this.state;

    const {
      errorIndicator,
      errorMessage,
      emptyMessage,
      loading,
      loadingIndicator,
      classes,
      children,
      hasData,
      emptyIndicator,
      type,
      errors,
      i18n
    } = this.props;

    if (error || errors) {
      return (
        errorIndicator || (
          <div className={classes.errorContainer}>
            <div className={classes.error}>
              <ListIcon icon={type} className={classes.errorIcon} />
              <h5 className={classes.errorMessage}>
                {errorMessage || i18n.t("errors.error_loading")}
              </h5>
              <Button
                variant="outlined"
                size="small"
                classes={{ root: classes.errorButton }}
                onClick={this.handleTryAgain}
              >
                {i18n.t("errors.try_again")}
              </Button>
            </div>
          </div>
        )
      );
    }

    if (loading) {
      return (
        loadingIndicator || (
          <Fade
            in={loading}
            style={{
              transitionDelay: loading ? "800ms" : "0ms"
            }}
            unmountOnExit
          >
            <div className={classes.loadingIndicator}>
              <CircularProgress size={80} />
            </div>
          </Fade>
        )
      );
    }

    if (!loading && !hasData) {
      return (
        emptyIndicator || (
          <div className={classes.emptyContainer}>
            <div className={classes.empty}>
              <ListIcon icon={type} className={classes.emptyIcon} />
              <h5 className={classes.emptyMessage}>
                {emptyMessage || i18n.t("errors.not_found")}
              </h5>
            </div>
          </div>
        )
      );
    }

    return children;
  }
}

LoadingIndicator.propTypes = {
  i18n: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  errors: PropTypes.bool,
  errorIndicator: PropTypes.node,
  errorMessage: PropTypes.string,
  loadingIndicator: PropTypes.node,
  classes: PropTypes.object,
  emptyIndicator: PropTypes.node,
  emptyMessage: PropTypes.string,
  children: PropTypes.node.isRequired,
  hasData: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired
};

export default withI18n(withStyles(styles)(LoadingIndicator));
