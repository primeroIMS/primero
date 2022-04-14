import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";

import { NAME } from "./constants";

const Component = ({ icon, id, rest, ...otherProps }) => {
  return (
    <IconButton id={id} size="small" color="primary" variant="text" {...rest} {...otherProps}>
      {icon}
    </IconButton>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  icon: PropTypes.object,
  id: PropTypes.string.isRequired,
  isTransparent: PropTypes.bool,
  rest: PropTypes.object,
  text: PropTypes.string
};

export default Component;
