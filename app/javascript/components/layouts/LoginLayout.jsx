import React from "react";
import PropTypes from "prop-types";
import { Login } from "components/pages/login";

const LoginLayout = ({ match }) => {
  return <Login logo={match.params.logo} />;
};

LoginLayout.propTypes = {
  match: PropTypes.object
};

export default LoginLayout;
