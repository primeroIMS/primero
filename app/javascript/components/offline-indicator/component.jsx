import React from "react";
import makeStyles from "@material-ui/styles/makeStyles";

import { useApp } from "../application";
import { useI18n } from "../i18n";

import styles from "./styles.css";

const Component = () => {
  const { online } = useApp();
  const css = makeStyles(styles)();
  const i18n = useI18n();

  if (online) return false;

  return <div className={css.offline}>{i18n.t("offline")}</div>;
};

Component.displayName = "OfflineIndicator";

export default Component;
