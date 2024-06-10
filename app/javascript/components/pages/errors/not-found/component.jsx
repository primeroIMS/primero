// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { CssBaseline, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { useI18n } from "../../../i18n";
import { ROUTES } from "../../../../config";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";

import css from "./styles.css";

const NotFound = () => {
  const i18n = useI18n();

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

NotFound.displayName = "NotFound";

export default NotFound;
