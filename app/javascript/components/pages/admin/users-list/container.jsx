// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import { batch, useDispatch } from "react-redux";
import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import NAMESPACE from "../namespace";
import { usePermissions, CREATE_RECORDS, READ_RECORDS, RESOURCES } from "../../../permissions";
import { FiltersForm } from "../../../form-filters/components";
import { fetchAgencies } from "../agencies-list/action-creators";
import {
  fetchUserGroups,
  getEnabledAgencies,
  getEnabledUserGroups,
  selectAgencies,
  useApp
} from "../../../application";
import { getAppliedFilters, getMetadata } from "../../../record-list";
import { useMetadata } from "../../../records";
import { useMemoizedSelector } from "../../../../libs";
import { DEFAULT_FILTERS, DATA } from "../constants";

import { fetchUsers, setUsersFilters } from "./action-creators";
import { LIST_HEADERS, AGENCY, DISABLED, USER_GROUP } from "./constants";
import { agencyBodyRender, buildObjectWithIds, buildUsersQuery, getFilters } from "./utils";
import AlertMaxUser from "./components/alert-max-user";
import CustomToolbar from "./components/custom-toolbar";
import NewUserBtn from "./components/new-user-button";

const Container = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { maximumUsers, maximumUsersWarning } = useApp();
  const canAddUsers = usePermissions(NAMESPACE, CREATE_RECORDS);
  const canListAgencies = usePermissions(RESOURCES.agencies, READ_RECORDS);
  const recordType = "users";

  const agencies = useMemoizedSelector(state => selectAgencies(state));
  const currentFilters = useMemoizedSelector(state => getAppliedFilters(state, recordType));
  const enabledAgencies = useMemoizedSelector(state => getEnabledAgencies(state));
  const filterUserGroups = useMemoizedSelector(state => getEnabledUserGroups(state));
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));
  const totalUsersEnabled = metadata?.get("total_enabled");
  const limitUsersReached = !Number.isNaN(maximumUsers) && totalUsersEnabled >= maximumUsers;
  const maximumUsersWarningEnabled = Number.isInteger(maximumUsersWarning);
  const maximumUsersLimit = maximumUsersWarningEnabled ? maximumUsersWarning : maximumUsers;

  const agenciesWithId = buildObjectWithIds(agencies);

  const columns = LIST_HEADERS.map(({ label, ...rest }) => ({
    label: i18n.t(label),
    ...rest,
    ...(rest.name === "agency_id"
      ? { options: { customBodyRender: value => agencyBodyRender(i18n, agenciesWithId, value) } }
      : {})
  }));

  const defaultFilters = fromJS({ ...DEFAULT_FILTERS, locale: i18n.locale }).merge(metadata);

  useEffect(() => {
    if (canListAgencies) {
      dispatch(fetchAgencies({ options: { per: 999 } }));
    }
    dispatch(fetchUserGroups());
  }, []);

  useMetadata(recordType, metadata, fetchUsers, DATA, {
    defaultFilterFields: { ...DEFAULT_FILTERS, locale: i18n.locale }
  });

  const onTableChange = filters => {
    const filtersData = filters.data || fromJS({});

    dispatch(setUsersFilters({ data: filtersData }));

    return fetchUsers(filters);
  };

  const tableOptions = {
    recordType,
    columns,
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange,
    bypassInitialFetch: true,
    // eslint-disable-next-line react/display-name, react/no-multi-comp
    customToolbarSelect: ({ displayData }) => (
      <CustomToolbar
        displayData={displayData}
        limitUsersReached={limitUsersReached}
        maximumUsers={maximumUsersLimit}
        totalUsersEnabled={totalUsersEnabled}
      />
    )
  };

  const filterPermission = {
    agency: canListAgencies
  };

  const filterProps = {
    clearFields: [AGENCY, DISABLED, USER_GROUP],
    filters: getFilters(i18n, enabledAgencies, filterUserGroups, filterPermission),
    defaultFilters,
    initialFilters: DEFAULT_FILTERS,
    onSubmit: data => {
      const filters = typeof data === "undefined" ? defaultFilters : buildUsersQuery(data);
      const mergedFilters = currentFilters.merge(fromJS(filters)).set("page", 1);

      batch(() => {
        dispatch(setUsersFilters({ data: mergedFilters }));
        dispatch(fetchUsers({ data: mergedFilters }));
      });
    }
  };

  useEffect(() => {
    dispatch(setUsersFilters({ data: defaultFilters }));
  }, []);

  return (
    <>
      <PageHeading title={i18n.t("users.label")}>
        <NewUserBtn canAddUsers={canAddUsers} limitUsersReached={limitUsersReached} maximumUsers={maximumUsers} />
      </PageHeading>
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <AlertMaxUser
              limitUsersReached={limitUsersReached}
              maximumUsers={maximumUsersLimit}
              totalUsersEnabled={totalUsersEnabled}
            />
            <IndexTable title={i18n.t("users.label")} {...tableOptions} showCustomToolbar renderTitleMessage />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FiltersForm {...filterProps} />
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
};

Container.displayName = "UsersList";

Container.propTypes = {};

export default Container;
