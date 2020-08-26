import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CssBaseline, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

import { useI18n } from "../../../i18n";
import { ROUTES } from "../../../../config";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";

import styles from "./styles.css";

const NotFound = () => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  return (
    <div className={css.root}>
      <CssBaseline />
      <Typography component="h1" color="primary">
        {i18n.t("error_page.not_found.code")}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {i18n.t("error_page.not_found.something_went_wrong")}
      </Typography>
      <Typography>{i18n.t("error_page.not_found.contact_admin")}</Typography>
      <ActionButton
        text={i18n.t("navigation.home")}
        type={ACTION_BUTTON_TYPES.default}
        rest={{
          "aria-label": i18n.t("navigation.home"),
          to: ROUTES.dashboard,
          component: Link
        }}
      />
    </div>
  );
};

NotFound.displayName = "NotFound";

export default NotFound;
