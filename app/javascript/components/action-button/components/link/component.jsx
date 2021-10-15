import PropTypes from "prop-types";
import { Link } from "@material-ui/core";

import { NAME } from "./constants";

const Component = ({ text, ...rest }) => {
  return (
    <Link underline="hover" {...rest}>
      {text}
    </Link>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  text: PropTypes.string
};

export default Component;
