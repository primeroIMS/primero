import React from "react";
import PropTypes from "prop-types";

const ValueContainer = props => {
  const { selectProps, children } = props;

  return <div className={selectProps.classes.valueContainer}>{children}</div>;
};

ValueContainer.propTypes = {
  children: PropTypes.node,
  selectProps: PropTypes.object.isRequired
};

export default ValueContainer;
