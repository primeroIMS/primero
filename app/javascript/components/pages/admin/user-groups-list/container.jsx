import React from "react";
import { fromJS } from "immutable";
import { IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { usePermissions, getListHeaders } from "../../../user";
import NAMESPACE from "../namespace";
import { CREATE_RECORDS, RESOURCES } from "../../../../libs/permissions";

import { NAME } from "./constants";
import { fetchUserGroups } from "./action-creators";

const Container = () => {
  const i18n = useI18n();
  const headers = useSelector(state =>
    getListHeaders(state, RESOURCES.user_groups)
  );
  const canAddUserGroups = usePermissions(NAMESPACE, CREATE_RECORDS);
  const recordType = RESOURCES.user_groups;

  const columns = headers.map(({ name, field_name: fieldName, ...rest }) => ({
    label: i18n.t(name),
    name: fieldName,
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
    onTableChange: fetchUserGroups
  };

  const newUserGroupBtn = canAddUserGroups ? (
    <IconButton
      to={ROUTES.admin_user_groups_new}
      component={Link}
      color="primary"
    >
      <AddIcon />
    </IconButton>
  ) : null;

  return (
    <>
      <PageHeading title={i18n.t("user_groups.label")}>
        {newUserGroupBtn}
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
