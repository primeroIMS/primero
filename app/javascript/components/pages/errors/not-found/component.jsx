import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Button, CssBaseline, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

import { useI18n } from "../../../i18n";

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

NotFound.displayName = "NotFound";

export default NotFound;
