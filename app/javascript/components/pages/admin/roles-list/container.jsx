import React from "react";
import { fromJS, List } from "immutable";
import { Button, makeStyles, useMediaQuery } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { NAMESPACE } from "../roles-form";
import { useThemeHelper } from "../../../../libs";
import styles from "../styles.css";

import { fetchRoles } from "./action-creators";
import { ADMIN_NAMESPACE, LIST_HEADERS, NAME } from "./constants";

const Container = () => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const { theme } = useThemeHelper(styles);
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));

  const columns = LIST_HEADERS.map(({ label, ...rest }) => ({
    label: i18n.t(label),
    ...rest
  }));

  const renderNewText = !mobileDisplay ? i18n.t("buttons.new") : null;

  const tableOptions = {
    recordType: [ADMIN_NAMESPACE, NAMESPACE],
    columns: List(columns),
    options: {
      selectableRows: "none"
    },
    defaultFilters: fromJS({
      per: 20,
      page: 1
    }),
    onTableChange: fetchRoles,
    targetRecordType: NAMESPACE
  };

  return (
    <>
      <PageHeading title={i18n.t("roles.label")}>
        <Button
          to={ROUTES.admin_roles_new}
          component={Link}
          color="primary"
          className={css.showActionButton}
        >
          <AddIcon />
          {renderNewText}
        </Button>
      </PageHeading>
      <PageContent>
        <IndexTable {...tableOptions} />
      </PageContent>
    </>
  );
};

Container.displayName = NAME;

export default Container;
