import React from "react";
import makeStyles from "@material-ui/styles/makeStyles";

import { useApp } from "../application";
import { useI18n } from "../i18n";

import styles from "./styles.css";

const Component = () => {
  const { online } = useApp();
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const divider = <div className={css.divider}>* * * * * * *</div>;

  if (online) return false;

  return (
    <div className={css.offline}>
      {divider}
      <div>{i18n.t("offline")}</div>
      {divider}
    </div>
  );
};

Component.displayName = "OfflineIndicator";

export default Component;
