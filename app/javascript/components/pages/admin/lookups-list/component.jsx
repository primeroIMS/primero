// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useI18n } from "../../../i18n";
import { ROUTES } from "../../../../config";
import { PageHeading, PageContent } from "../../../page";
import IndexTable from "../../../index-table";
import Permission, { MANAGE, RESOURCES } from "../../../permissions";
import { useMemoizedSelector } from "../../../../libs";
import { getMetadata } from "../../../record-list";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { useMetadata } from "../../../records";
import { useApp } from "../../../application";
import { filterOnTableChange } from "../utils";

import { NAME } from "./constants";
import { fetchAdminLookups, setLookupsFilter } from "./action-creators";
import css from "./styles.css";
import { columns } from "./utils";

const Component = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const recordType = ["admin", "lookups"];

  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));

  const defaultFilters = metadata.set("locale", i18n.locale);
  const { limitedProductionSite } = useApp();

  const newUserGroupBtn = (
    <ActionButton
      icon={<AddIcon />}
      text="buttons.new"
      type={ACTION_BUTTON_TYPES.default}
      rest={{
        to: ROUTES.lookups_new,
        component: Link,
        hide: limitedProductionSite
      }}
    />
  );

  const onTableChange = filterOnTableChange(dispatch, fetchAdminLookups, setLookupsFilter);

  useMetadata(recordType, metadata, fetchAdminLookups, "data", { defaultFilterFields: { locale: i18n.locale } });

  const tableOptions = {
    recordType,
    columns: columns(i18n, css),
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange,
    localizedFields: ["name", "values"],
    targetRecordType: "lookups",
    bypassInitialFetch: true
  };

  useEffect(() => {
    dispatch(setLookupsFilter({ data: defaultFilters }));
  }, []);

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
