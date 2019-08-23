import React from "react";
import PropTypes from "prop-types";
import { CircularProgress, Fade, withStyles, Button } from "@material-ui/core";
import { ListIcon } from "components/list-icon";
import { withI18n } from "components/i18n";
import styles from "./styles.css";

const Loading = ({ loadingIndicator, loading, classes }) =>
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

Loading.propTypes = {
  classes: PropTypes.string.isRequired,
  loadingIndicator: PropTypes.node,
  loading: PropTypes.bool
};

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
      i18n,
      overlay
    } = this.props;

    const loadingProps = {
      classes: classes.loadingIndicator,
      loading,
      loadingIndicator
    };

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

    if (loading && !overlay) {
      return <Loading {...loadingProps} />;
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

    return (
      <>
        {overlay && <Loading {...loadingProps} />}
        {children}
      </>
    );
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
  type: PropTypes.string.isRequired,
  overlay: PropTypes.bool
};

export default withI18n(withStyles(styles)(LoadingIndicator));
