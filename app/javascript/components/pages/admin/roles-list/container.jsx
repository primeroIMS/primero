import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List } from "immutable";
import AddIcon from "@material-ui/icons/Add";
import { Link, useHistory, useLocation } from "react-router-dom";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { NAMESPACE } from "../roles-form";
import { getMetadata } from "../../../record-list";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { RESOURCES } from "../../../../libs/permissions";
import { useMetadata } from "../../../records";

import { fetchRoles } from "./action-creators";
import { ADMIN_NAMESPACE, LIST_HEADERS, NAME } from "./constants";

const Container = () => {
  const i18n = useI18n();
  const recordType = RESOURCES.roles;

  const columns = LIST_HEADERS.map(({ label, ...rest }) => ({
    label: i18n.t(label),
    ...rest
  }));
  const metadata = useSelector(state => getMetadata(state, "roles"));
  const defaultFilters = metadata;
  const location = useLocation();

  useMetadata(recordType, metadata, location, fetchRoles, "data");

  const tableOptions = {
    recordType: [ADMIN_NAMESPACE, NAMESPACE],
    columns: List(columns),
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange: fetchRoles,
    targetRecordType: NAMESPACE,
    bypassInitialFetch: true
  };

  return (
    <>
      <PageHeading title={i18n.t("roles.label")}>
        <ActionButton
          icon={<AddIcon />}
          text={i18n.t("buttons.new")}
          type={ACTION_BUTTON_TYPES.default}
          rest={{
            to: ROUTES.admin_roles_new,
            component: Link
          }}
        />
      </PageHeading>
      <PageContent>
        <IndexTable title={i18n.t("roles.label")} {...tableOptions} />
      </PageContent>
    </>
  );
};

Container.displayName = NAME;

export default Container;
