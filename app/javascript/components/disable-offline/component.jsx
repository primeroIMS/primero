import React, { cloneElement } from "react";
import PropTypes from "prop-types";
import { Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { useApp } from "../application";
import { useI18n } from "../i18n";

import styles from "./styles.css";

const Component = ({ children, button, offlineTextKey }) => {
  const css = makeStyles(styles)();
  const { online } = useApp();
  const i18n = useI18n();

  if (!online) {
    return (
      <Tooltip title={i18n.t(offlineTextKey || "offline")}>
        <div
          className={clsx(css.disabledLink, {
            [css.disabled]: !button
          })}
        >
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
  offlineTextKey: null
};

Component.propTypes = {
  button: PropTypes.bool,
  children: PropTypes.node,
  offlineTextKey: PropTypes.string
};

Component.displayName = "DisableOffline";

export default Component;
