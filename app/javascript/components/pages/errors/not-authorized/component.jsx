import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Button, CssBaseline, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

import { useI18n } from "../../../i18n";

import styles from "./styles.css";

const NotAuthorized = () => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  return (
    <div className={css.root}>
      <CssBaseline />
      <Typography component="h1" color="primary">
        {i18n.t("error_page.not_authorized.code")}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {i18n.t("error_page.not_authorized.title")}
      </Typography>
      <Typography>
        {i18n.t("error_page.not_authorized.server_error")}
      </Typography>
      <Button
        to="/dashboard"
        variant="contained"
        color="primary"
        component={Link}
      >
        {i18n.t("navigation.home")}
      </Button>
    </div>
  );
};

export default NotAuthorized;
