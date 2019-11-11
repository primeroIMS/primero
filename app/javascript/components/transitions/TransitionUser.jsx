import React from "react";
import { Box } from "@material-ui/core";
import PropTypes from "prop-types";

import { useI18n } from "../i18n";

const TransitionUser = ({ label, transitionUser, classes }) => {
  const i18n = useI18n();

  return (
    <Box className={classes.spaceGrid}>
      <div className={classes.transtionLabel}>{i18n.t(label)}</div>
      <div className={classes.transtionValue}>{transitionUser}</div>
    </Box>
  );
};

TransitionUser.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  transitionUser: PropTypes.string.isRequired
};

export default TransitionUser;
