import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";

import { NAME } from "./constants";

const Component = ({ icon, rest }) => {
  return (
    <IconButton size="small" color="primary" variant="text" {...rest}>
      {icon}
    </IconButton>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  icon: PropTypes.object,
  isTransparent: PropTypes.bool,
  rest: PropTypes.object,
  text: PropTypes.string
};

export default Component;
