import React from "react";
import { makeStyles } from "@material-ui/styles/";
import { useI18n } from "components/i18n";
import { ModuleLogo } from "components/module-logo";
import { Home } from "@material-ui/icons";
import { Link, Button } from "@material-ui/core";
import styles from "./styles.css";

const NotFound = () => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  return (
    <>
      <div className={css.notFoundImg}>
        <ModuleLogo moduleLogo="primero" />
      </div>
      <div className={css.root}>
        <div className={css.notFound}>
          <div className={css.notFound404}>
            <h1>{i18n.t("error_page.not_found.code")}</h1>
          </div>
          <h2 className={css.message}>
            {i18n.t("error_page.not_found.something_went_wrong")}
          </h2>
          <p>{i18n.t("error_page.not_found.contact_admin")}</p>
          <div className={css.homeButton}>
            <Link href="/v2/dashboard" underline="none">
              <Button variant="contained" color="primary">
                <Home />
                {i18n.t("navigation.home")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
