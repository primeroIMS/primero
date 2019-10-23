import React from "react";
import { useI18n } from "components/i18n";
import { Box } from "@material-ui/core";
import PropTypes from "prop-types";

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
  label: PropTypes.string.isRequired,
  transitionUser: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export default TransitionUser;
