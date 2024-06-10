// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { cloneElement } from "react";
import PropTypes from "prop-types";
import { Tooltip } from "@mui/material";
import clsx from "clsx";

import { useApp } from "../application";
import { useI18n } from "../i18n";

import css from "./styles.css";

const Component = ({ overrideCondition, children, button, offlineTextKey }) => {
  const { online } = useApp();
  const i18n = useI18n();
  const classes = clsx(css.disabledLink, {
    [css.disabled]: !button
  });

  if (overrideCondition || !online) {
    return (
      <Tooltip title={i18n.t(offlineTextKey || "offline")} enterTouchDelay={20}>
        <div className={classes} data-testid="disable-offline">
          {!button && <div className={css.disabledElement} />}
          {cloneElement(children, { disabled: true })}
        </div>
      </Tooltip>
    );
  }

  return children;
};

Component.defaultProps = {
  button: false,
  offlineTextKey: null,
  overrideCondition: false
};

Component.propTypes = {
  button: PropTypes.bool,
  children: PropTypes.node,
  offlineTextKey: PropTypes.string,
  overrideCondition: PropTypes.bool
};

Component.displayName = "DisableOffline";

export default Component;
