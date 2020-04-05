import React, { cloneElement } from "react";
import PropTypes from "prop-types";
import { Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { useApp } from "../application";
import { useI18n } from "../i18n";

import styles from "./styles.css";

const Component = ({ children }) => {
  const css = makeStyles(styles)();
  const { online } = useApp();
  const i18n = useI18n();

  if (!online) {
    return (
      <Tooltip title={i18n.t("offline")}>
        <div className={css.disabledLink}>
          {cloneElement(children, { disabled: true })}
        </div>
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
