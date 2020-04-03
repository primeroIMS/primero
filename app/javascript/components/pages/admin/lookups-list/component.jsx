import React from "react";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { fromJS } from "immutable";
import { makeStyles } from "@material-ui/core/styles";

import { useI18n } from "../../../i18n";
import { ROUTES } from "../../../../config";
import { PageHeading, PageContent } from "../../../page";
import IndexTable from "../../../index-table";
import { MANAGE, RESOURCES } from "../../../../libs/permissions";
import Permission from "../../../application/permission";

import { NAME } from "./constants";
import { fetchAdminLookups } from "./action-creators";
import styles from "./styles.css";
import { columns } from "./helpers";

const Component = () => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const newUserGroupBtn = (
    <Button
      to={ROUTES.lookups}
      component={Link}
      color="primary"
      startIcon={<AddIcon />}
    >
      {i18n.t("buttons.new")}
    </Button>
  );

  const tableOptions = {
    recordType: ["admin", "lookups"],
    columns: columns(i18n, css),
    options: {
      selectableRows: "none"
    },
    defaultFilters: fromJS({
      per: 20,
      page: 1
    }),
    onTableChange: fetchAdminLookups,
    localizedFields: ["name", "values"]
  };

  return (
    <Permission resources={RESOURCES.metadata} actions={MANAGE} redirect>
      <PageHeading title={i18n.t("settings.navigation.lookups")}>
        {newUserGroupBtn}
      </PageHeading>
      <PageContent>
        <IndexTable {...tableOptions} />
      </PageContent>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {};

export default Component;
