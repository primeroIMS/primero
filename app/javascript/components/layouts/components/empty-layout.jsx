/* eslint-disable react/no-multi-comp, react/display-name */
import PropTypes from "prop-types";

const EmptyLayout = ({ children }) => {
  return children;
};

EmptyLayout.displayName = "EmptyLayout";

EmptyLayout.propTypes = {
  children: PropTypes.node
};

export default EmptyLayout;
