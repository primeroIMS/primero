import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";

import { NAME } from "./constants";

const Component = ({ icon, id, rest }) => {
  return (
    <IconButton id={id} size="small" color="primary" variant="text" {...rest}>
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
