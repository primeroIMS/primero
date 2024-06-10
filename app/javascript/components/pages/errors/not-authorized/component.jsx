// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { CssBaseline, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { useI18n } from "../../../i18n";
import { ROUTES } from "../../../../config";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";

import css from "./styles.css";

const NotAuthorized = () => {
  const i18n = useI18n();

  return (
    <div className={css.root}>
      <CssBaseline />
      <Typography component="h1" color="primary">
        {i18n.t("error_page.not_authorized.code")}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {i18n.t("error_page.not_authorized.title")}
      </Typography>
      <Typography>{i18n.t("error_page.not_authorized.server_error")}</Typography>
      <ActionButton
        text="navigation.home"
        type={ACTION_BUTTON_TYPES.default}
        rest={{
          to: ROUTES.dashboard,
          component: Link
        }}
      />
    </div>
  );
};

NotAuthorized.displayName = "NotAuthorized";

export default NotAuthorized;
