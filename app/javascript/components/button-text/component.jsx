import PropTypes from "prop-types";
import { useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";

import { NAME } from "./constants";

const Component = ({ text, keepTextOnMobile }) => {
  const theme = useTheme();
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));

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
