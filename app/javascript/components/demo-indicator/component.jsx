import PropTypes from "prop-types";
import Alert from "@material-ui/lab/Alert";
import { useMediaQuery } from "@material-ui/core";

import { useI18n } from "../i18n";
import { DEMO } from "../application/constants";

import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ isDemo }) => {
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));
  const i18n = useI18n();
  const classes = { standardInfo: css.standardInfo, message: css.standardInfoText };

  if (!isDemo || mobileDisplay) {
    return null;
  }

  return (
    <Alert icon={false} severity="info" classes={classes}>
      {i18n.t(DEMO)}
    </Alert>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  isDemo: PropTypes.bool.isRequired
};

export default Component;
