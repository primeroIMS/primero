import React from "react";
import { fromJS } from "immutable";
import { IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";

import { fetchUsers } from "./action-creators";
import { LIST_HEADERS } from "./constants";

const Container = () => {
  const i18n = useI18n();
  const recordType = "users";

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
    onTableChange: fetchUsers
  };

  return (
    <>
      <PageHeading title={i18n.t("users.label")}>
        <IconButton
          to={ROUTES.admin_users_new}
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

Container.displayName = "UsersList";

Container.propTypes = {};

export default Container;
