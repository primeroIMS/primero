import { useEffect, useState } from "react";
import { batch, useDispatch } from "react-redux";
import { fromJS } from "immutable";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import NAMESPACE from "../namespace";
import { usePermissions, READ_RECORDS, RESOURCES } from "../../../permissions";
import { FiltersForm } from "../../../form-filters/components";
import { fetchAgencies } from "../agencies-list/action-creators";
import {
  fetchRoles,
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
import { useDialog } from "../../../action-dialog";
import Menu from "../../../menu";
import { getRoles } from "../../../application/selectors";

import { fetchUsers, setUsersFilters } from "./action-creators";
import {
  LIST_HEADERS,
  AGENCY,
  DISABLED,
  USER_GROUP,
  LAST_DATE,
  ACTIVITY_FILTERS,
  USERS_DIALOG,
  ACTION_IDS,
  USERS_ABILITIES,
  ROLE_ID
} from "./constants";
import { agencyBodyRender, buildObjectWithIds, getFilters, buildActionList, roleBodyRender } from "./utils";
import AlertMaxUser from "./components/alert-max-user";
import NewUserBtn from "./components/new-user-button";
import DisableDialog from "./components/disable-dialog";
import css from "./styles.css";

function Container() {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [selectedRecords, setSelectedRecords] = useState({});
  const { maximumUsers, maximumUsersWarning } = useApp();
  const { canAddUsers, canDisableMultiple } = usePermissions(NAMESPACE, USERS_ABILITIES);
  const canListAgencies = usePermissions(RESOURCES.agencies, READ_RECORDS);
  const { setDialog } = useDialog(USERS_DIALOG);
  const recordType = "users";

  const agencies = useMemoizedSelector(state => selectAgencies(state));
  const roles = useMemoizedSelector(state => getRoles(state, recordType));
  const currentFilters = useMemoizedSelector(state => getAppliedFilters(state, recordType));
  const enabledAgencies = useMemoizedSelector(state => getEnabledAgencies(state));
  const filterUserGroups = useMemoizedSelector(state => getEnabledUserGroups(state));
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));
  const totalUsersEnabled = metadata?.get("total_enabled");
  const limitUsersReached = Number.isInteger(maximumUsers) && totalUsersEnabled >= maximumUsers;
  const maximumUsersWarningEnabled = Number.isInteger(maximumUsersWarning);
  const maximumUsersLimit = maximumUsersWarningEnabled ? maximumUsersWarning : maximumUsers;

  const agenciesWithId = buildObjectWithIds(agencies);
  const columns = LIST_HEADERS.map(({ label, ...rest }) => ({
    label: i18n.t(label),
    ...rest,
    ...(rest.name === "role_unique_id"
      ? {
          options: {
            customBodyRender: value => roleBodyRender(roles, value)
          }
        }
      : {}),
    ...(rest.name === "agency_id"
      ? { options: { customBodyRender: value => agencyBodyRender(i18n, agenciesWithId, value) } }
      : {})
  }));

  const defaultFilters = fromJS({ ...DEFAULT_FILTERS, locale: i18n.locale }).merge(metadata);

  useEffect(() => {
    if (canListAgencies) {
      dispatch(fetchAgencies({ options: { per: 999 } }));
    }
    dispatch(fetchRoles());
    dispatch(fetchUserGroups());
  }, []);

  useMetadata(recordType, metadata, fetchUsers, DATA, {
    defaultFilterFields: { ...DEFAULT_FILTERS, locale: i18n.locale },
    includeQueryParams: true
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
      selectableRows: "multiple"
    },
    defaultFilters,
    onTableChange,
    bypassInitialFetch: true,
    setSelectedRecords,
    selectedRecords
  };

  const handleDialogClick = (dialog, action) => {
    setDialog({ dialog, open: true, params: { action } });
  };

  const filterPermission = {
    agency: canListAgencies
  };

  const filterProps = {
    clearFields: [AGENCY, DISABLED, USER_GROUP, LAST_DATE, ROLE_ID],
    filters: getFilters(i18n, enabledAgencies, filterUserGroups, filterPermission, roles),
    defaultFilters,
    initialFilters: DEFAULT_FILTERS,
    onSubmit: data => {
      const filters = typeof data === "undefined" ? defaultFilters : data;
      let mergedFilters = currentFilters.merge(fromJS(filters)).set("page", 1);

      if (ACTIVITY_FILTERS.some(key => mergedFilters.has(key))) {
        mergedFilters = mergedFilters.set("activity_stats", true);
      }

      batch(() => {
        dispatch(setUsersFilters({ data: mergedFilters }));
        dispatch(fetchUsers({ data: mergedFilters }));
      });
    }
  };

  const actions = buildActionList({ i18n, handleDialogClick, canDisableMultiple });

  const disabledCondition = action =>
    [ACTION_IDS.disable].includes(action.id) ? isEmpty(Object.values(selectedRecords).flat()) : false;

  useEffect(() => {
    dispatch(setUsersFilters({ data: defaultFilters }));
  }, []);

  return (
    <>
      <PageHeading title={i18n.t("users.label")}>
        <NewUserBtn canAddUsers={canAddUsers} limitUsersReached={limitUsersReached} maximumUsers={maximumUsers} />
        <Menu
          data-testid="action-menu"
          showMenu={Boolean(actions.length)}
          actions={actions}
          disabledCondition={disabledCondition}
        />
      </PageHeading>
      <PageContent>
        <div className={css.container}>
          <div>
            <AlertMaxUser
              limitUsersReached={limitUsersReached}
              maximumUsers={maximumUsersLimit}
              totalUsersEnabled={totalUsersEnabled}
            />
            <IndexTable title={i18n.t("users.label")} {...tableOptions} showCustomToolbar renderTitleMessage />
          </div>
          <div>
            <DisableDialog
              selectedRecords={selectedRecords}
              recordType={recordType}
              filters={currentFilters}
              setSelectedRecords={setSelectedRecords}
            />
            <FiltersForm {...filterProps} noMargin searchFieldLabel={i18n.t("users.filters.search")} showSearchField />
          </div>
        </div>
      </PageContent>
    </>
  );
}

Container.displayName = "UsersList";

Container.propTypes = {};

export default Container;
