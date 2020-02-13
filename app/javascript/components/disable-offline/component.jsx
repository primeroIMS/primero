import React, { cloneElement } from "react";
import PropTypes from "prop-types";
import { Tooltip } from "@material-ui/core";

import { useApp } from "../application";
import { useI18n } from "../i18n";

const Component = ({ children }) => {
  const { online } = useApp();
  const i18n = useI18n();

  if (!online) {
    return (
      <Tooltip title={i18n.t("offline")}>
        {cloneElement(children, { disabled: true })}
      </Tooltip>
    );
  }

  return children;
};

Component.propTypes = {
  children: PropTypes.node
};

Component.displayName = "DisableOffline";

export default Component;
