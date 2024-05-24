// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import ApplicationRoutes from "../../application-routes";
import PageContainer from "../../page";

import AdminNav from "./admin-nav";
import css from "./styles.css";

const Container = ({ routes }) => {
  return (
    <PageContainer>
      <div className={css.container}>
        <div className={css.nav}>
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
