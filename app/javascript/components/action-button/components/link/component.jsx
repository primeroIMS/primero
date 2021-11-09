import PropTypes from "prop-types";
import { Link } from "@material-ui/core";

import { NAME } from "./constants";

const Component = ({ text, id, ...rest }) => {
  return (
    <Link id={id} underline="hover" {...rest}>
      {text}
    </Link>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string
};

export default Component;
