import React from "react";
import { Tooltip as MuiToolTip } from "@material-ui/core";
import PropTypes from "prop-types";

import { useI18n } from "../i18n";

const Tooltip = ({ title, children }) => {
  const i18n = useI18n();

  return (
    <MuiToolTip title={i18n.t(title, { defaultValue: "" })}>
      {children}
    </MuiToolTip>
  );
};

Tooltip.displayName = "Tooltip";

Tooltip.defaultProps = {
  title: ""
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
};

export default Tooltip;
