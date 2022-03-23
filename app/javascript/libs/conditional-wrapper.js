/* eslint-disable import/prefer-default-export */
import PropTypes from "prop-types";

const ConditionalWrapper = ({ condition, wrapper: Wrapper, children, ...rest }) => {
  if (condition) {
    return typeof Wrapper === "function" ? Wrapper({ children, ...rest }) : <Wrapper {...rest}>{children}</Wrapper>;
  }

  return children;
};

ConditionalWrapper.displayName = "ConditionalWrapper";

ConditionalWrapper.propTypes = {
  children: PropTypes.node,
  condition: PropTypes.bool,
  wrapper: PropTypes.node
};

export { ConditionalWrapper };
