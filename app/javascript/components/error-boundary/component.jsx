import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import first from "lodash/first";
import compact from "lodash/compact";

import { ErrorState } from "./components";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleTryAgain = this.handleTryAgain.bind(this);
    this.window = window;
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: !!error };
  }

  handleTryAgain() {
    this.window.location.reload();
  }

  render() {
    const { hasError } = this.state;
    const { children, location } = this.props;
    const type = first(compact(location.pathname.split("/")));
    const errorMessage = type && this.window.I18n.t(`${type}.error_loading`);

    if (hasError) {
      return <ErrorState handleTryAgain={this.handleTryAgain} type={type} errorMessage={errorMessage} />;
    }

    return children;
  }
}

ErrorBoundary.displayName = "ErrorBoundary";

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired
};

export default withRouter(ErrorBoundary);
