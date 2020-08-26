import React from "react";
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
import { getMetadata } from "../../../record-list";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { useMetadata } from "../../../records";

import { NAME } from "./constants";
import { fetchUserGroups } from "./action-creators";

const Container = () => {
  const i18n = useI18n();
  const headers = useSelector(state => getListHeaders(state, RESOURCES.user_groups));
  const canAddUserGroups = usePermissions(NAMESPACE, CREATE_RECORDS);
  const recordType = RESOURCES.user_groups;
  const metadata = useSelector(state => getMetadata(state, recordType));
  const defaultFilters = metadata;

  const columns = headers.map(({ name, field_name: fieldName, ...rest }) => ({
    label: i18n.t(name),
    name: fieldName,
    ...rest
  }));

  useMetadata(recordType, metadata, fetchUserGroups, "data");

  const tableOptions = {
    recordType,
    columns,
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange: fetchUserGroups,
    bypassInitialFetch: true
  };

  const newUserGroupBtn = canAddUserGroups ? (
    <ActionButton
      icon={<AddIcon />}
      text={i18n.t("buttons.new")}
      type={ACTION_BUTTON_TYPES.default}
      rest={{
        "aria-label": i18n.t("buttons.new"),
        to: ROUTES.admin_user_groups_new,
        component: Link
      }}
    />
  ) : null;

  return (
    <>
      <PageHeading title={i18n.t("user_groups.label")}>{newUserGroupBtn}</PageHeading>
      <PageContent>
        <IndexTable title={i18n.t("user_groups.label")} {...tableOptions} />
      </PageContent>
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {};

export default Container;
