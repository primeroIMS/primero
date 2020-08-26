import React from "react";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { usePermissions } from "../../../user";
import NAMESPACE from "../namespace";
import { CREATE_RECORDS, RESOURCES } from "../../../../libs/permissions";
import { getMetadata } from "../../../record-list";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { useMetadata } from "../../../records";

import { NAME } from "./constants";
import { getColumns } from "./utils";
import { fetchConfigurations } from "./action-creators";

const Container = () => {
  const i18n = useI18n();
  const canAddUserGroups = usePermissions(NAMESPACE, CREATE_RECORDS);
  const recordType = RESOURCES.configurations;
  const metadata = useSelector(state => getMetadata(state, recordType));
  const defaultFilters = metadata;

  useMetadata(recordType, metadata, fetchConfigurations, "data");

  const tableOptions = {
    recordType,
    columns: getColumns(i18n),
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange: fetchConfigurations,
    bypassInitialFetch: true
  };

  const newConfigurationButton = canAddUserGroups ? (
    <ActionButton
      icon={<AddIcon />}
      text={i18n.t("buttons.new")}
      type={ACTION_BUTTON_TYPES.default}
      rest={{
        to: ROUTES.admin_configurations_new,
        component: Link
      }}
    />
  ) : null;

  return (
    <>
      <PageHeading title={i18n.t("configurations.label")}>{newConfigurationButton}</PageHeading>
      <PageContent>
        <IndexTable title={i18n.t("configurations.label")} {...tableOptions} />
      </PageContent>
    </>
  );
};

Container.displayName = NAME;

export default Container;
