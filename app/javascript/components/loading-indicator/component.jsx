import { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";

import { ErrorState } from "../error-boundary/components";

import Loading from "./loading";
import styles from "./styles.css";
import EmptyState from "./components/empty-state";

class LoadingIndicator extends Component {
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
      fromTableList
    } = this.props;

    const loadingProps = {
      classes: classes.loadingIndicator,
      loading,
      loadingIndicator
    };

    if (error || errors) {
      return (
        errorIndicator || <ErrorState errorMessage={errorMessage} handleTryAgain={this.handleTryAgain} type={type} />
      );
    }

    if (loading && !hasData) {
      return <Loading {...loadingProps} />;
    }

    if (loading === false && !hasData && !fromTableList) {
      return emptyIndicator || <EmptyState type={type} emptyMessage={emptyMessage} />;
    }

    return children;
  }
}

LoadingIndicator.displayName = "LoadingIndicator";

LoadingIndicator.defaultProps = {
  fromTableList: false,
  type: ""
};

LoadingIndicator.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object,
  emptyIndicator: PropTypes.node,
  emptyMessage: PropTypes.string,
  errorIndicator: PropTypes.node,
  errorMessage: PropTypes.string,
  errors: PropTypes.bool,
  fromTableList: PropTypes.bool,
  hasData: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  loadingIndicator: PropTypes.node,
  overlay: PropTypes.bool,
  type: PropTypes.string
};

export default withStyles(styles)(LoadingIndicator);
