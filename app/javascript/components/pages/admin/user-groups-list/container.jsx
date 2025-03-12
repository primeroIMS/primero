// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Unstable_Grid2";
import { useDispatch } from "react-redux";
import { fromJS } from "immutable";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { getListHeaders } from "../../../application";
import NAMESPACE from "../namespace";
import { usePermissions, CREATE_RECORDS, RESOURCES } from "../../../permissions";
import { getAppliedFilters, getMetadata } from "../../../record-list";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { useMetadata } from "../../../records";
import { useMemoizedSelector } from "../../../../libs";
import { FiltersForm } from "../../../form-filters/components";
import { DEFAULT_FILTERS, DISABLED, DATA } from "../constants";
import { filterOnTableChange, onSubmitFilters } from "../utils";

import { getUserGroupFilters } from "./utils";
import { AGENCY_UNIQUE_IDS, NAME } from "./constants";
import { fetchUserGroups, setUserGroupsFilter } from "./action-creators";

function Container() {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const canAddUserGroups = usePermissions(NAMESPACE, CREATE_RECORDS);

  const recordType = RESOURCES.user_groups;

  const headers = useMemoizedSelector(state => getListHeaders(state, RESOURCES.user_groups));
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));
  const currentFilters = useMemoizedSelector(state => getAppliedFilters(state, recordType));

  const defaultFilters = fromJS(DEFAULT_FILTERS).merge(metadata);

  const columns = headers.map(({ name, field_name: fieldName, ...rest }) => ({
    label: i18n.t(name),
    name: fieldName,
    ...rest
  }));

  useMetadata(recordType, metadata, fetchUserGroups, DATA, { defaultFilterFields: DEFAULT_FILTERS });

  const onSubmit = data =>
    onSubmitFilters(
      currentFilters.merge(fromJS(data || DEFAULT_FILTERS)),
      dispatch,
      fetchUserGroups,
      setUserGroupsFilter
    );

  const onTableChange = filterOnTableChange(dispatch, fetchUserGroups, setUserGroupsFilter);

  const filterProps = {
    clearFields: [DISABLED, AGENCY_UNIQUE_IDS],
    filters: getUserGroupFilters(i18n),
    onSubmit,
    defaultFilters,
    initialFilters: DEFAULT_FILTERS
  };

  const tableOptions = {
    recordType,
    columns,
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange,
    bypassInitialFetch: true
  };

  const newUserGroupBtn = canAddUserGroups ? (
    <ActionButton
      icon={<AddIcon />}
      text="buttons.new"
      type={ACTION_BUTTON_TYPES.default}
      rest={{
        to: ROUTES.admin_user_groups_new,
        component: Link
      }}
    />
  ) : null;

  useEffect(() => {
    dispatch(setUserGroupsFilter({ data: defaultFilters }));
  }, []);

  return (
    <>
      <PageHeading title={i18n.t("user_groups.label")}>{newUserGroupBtn}</PageHeading>
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <IndexTable title={i18n.t("user_groups.label")} {...tableOptions} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FiltersForm {...filterProps} noMargin />
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
}

Container.displayName = NAME;

Container.propTypes = {};

export default Container;
