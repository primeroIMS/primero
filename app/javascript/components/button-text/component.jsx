import PropTypes from "prop-types";
import { useMediaQuery } from "@material-ui/core";

import { NAME } from "./constants";

const Component = ({ text, keepTextOnMobile }) => {
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));

  if (mobileDisplay && !keepTextOnMobile) {
    return null;
  }

  return <>{text}</>;
};

Component.displayName = NAME;

Component.defaultProps = {
  keepTextOnMobile: false
};

Component.propTypes = {
  keepTextOnMobile: PropTypes.bool,
  text: PropTypes.string.isRequired
};

export default Component;
