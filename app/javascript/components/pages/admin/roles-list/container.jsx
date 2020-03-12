import React from "react";
import { fromJS } from "immutable";
import { IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";

import { fetchRoles } from "./action-creators";
import { LIST_HEADERS, NAME } from "./constants";

const Container = () => {
  const i18n = useI18n();
  const recordType = "roles";

  const columns = LIST_HEADERS.map(({ label, ...rest }) => ({
    label: i18n.t(label),
    ...rest
  }));

  const tableOptions = {
    recordType,
    columns,
    options: {
      selectableRows: "none"
    },
    defaultFilters: fromJS({
      per: 20,
      page: 1
    }),
    onTableChange: fetchRoles
  };

  return (
    <>
      <PageHeading title={i18n.t("roles.label")}>
        <IconButton
          to={ROUTES.admin_roles_new}
          component={Link}
          color="primary"
        >
          <AddIcon />
        </IconButton>
      </PageHeading>
      <PageContent>
        <IndexTable {...tableOptions} />
      </PageContent>
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {};

export default Container;
