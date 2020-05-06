import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles/";

import ApplicationRoutes from "../../application-routes";
import { PageContainer, PageHeading } from "../../page";
import { useI18n } from "../../i18n";

import AdminNav from "./admin-nav";
import styles from "./styles.css";

const Container = ({ routes }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  return (
    <PageContainer>
      <div className={css.container}>
        <div className={css.nav}>
          <PageHeading title={i18n.t("settings.title")} />
          <AdminNav />
        </div>
        <div className={css.content}>
          <ApplicationRoutes routes={routes} />
        </div>
      </div>
    </PageContainer>
  );
};

Container.displayName = "Admin";

Container.propTypes = {
  routes: PropTypes.array.isRequired
};

export default Container;
