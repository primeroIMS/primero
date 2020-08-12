import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import { Link, useHistory, useLocation } from "react-router-dom";
import { push } from "connected-react-router";

import { useI18n } from "../../../i18n";
import { ROUTES, RECORD_PATH } from "../../../../config";
import { PageHeading, PageContent } from "../../../page";
import IndexTable from "../../../index-table";
import { MANAGE, RESOURCES } from "../../../../libs/permissions";
import Permission from "../../../application/permission";
import { useThemeHelper } from "../../../../libs";
import { getMetadata } from "../../../record-list";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { fetchDataIfNotBackButton, clearMetadataOnLocationChange } from "../../../records";

import { NAME } from "./constants";
import { fetchAdminLookups } from "./action-creators";
import styles from "./styles.css";
import { columns } from "./utils";

const Component = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { css } = useThemeHelper(styles);
  const recordType = ["admin", "lookups"];
  const metadata = useSelector(state => getMetadata(state, recordType));
  const defaultFilters = metadata;
  const history = useHistory();
  const location = useLocation();

  const newUserGroupBtn = (
    <ActionButton
      icon={<AddIcon />}
      text={i18n.t("buttons.new")}
      type={ACTION_BUTTON_TYPES.default}
      rest={{
        to: ROUTES.lookups_new,
        component: Link
      }}
    />
  );

  useEffect(() => {
    fetchDataIfNotBackButton(metadata?.toJS(), location, history, fetchAdminLookups, "data", { dispatch });
  }, [location]);

  useEffect(() => {
    return () => {
      clearMetadataOnLocationChange(location, history, recordType, 1, {
        dispatch
      });
    };
  }, []);

  const onRowClick = data => dispatch(push(`${RECORD_PATH.lookups}/${data?.rowData[0]}`));

  const tableOptions = {
    recordType,
    columns: columns(i18n, css, onRowClick),
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange: fetchAdminLookups,
    localizedFields: ["name", "values"],
    targetRecordType: "lookups",
    bypassInitialFetch: true
  };

  return (
    <Permission resources={RESOURCES.metadata} actions={MANAGE} redirect>
      <PageHeading title={i18n.t("settings.navigation.lookups")}>{newUserGroupBtn}</PageHeading>
      <PageContent>
        <IndexTable title={i18n.t("settings.navigation.lookups")} {...tableOptions} />
      </PageContent>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {};

export default Component;
