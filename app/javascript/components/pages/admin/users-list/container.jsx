import { useEffect } from "react";
import { batch, useDispatch } from "react-redux";
import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { usePermissions } from "../../../user";
import NAMESPACE from "../namespace";
import { CREATE_RECORDS, READ_RECORDS, RESOURCES } from "../../../../libs/permissions";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { FiltersForm } from "../../../form-filters/components";
import { fetchAgencies } from "../agencies-list/action-creators";
import { fetchUserGroups, getEnabledAgencies, getEnabledUserGroups, selectAgencies } from "../../../application";
import { getMetadata } from "../../../record-list";
import { useMetadata } from "../../../records";
import { useMemoizedSelector } from "../../../../libs";

import { fetchUsers, setUsersFilters } from "./action-creators";
import { LIST_HEADERS, AGENCY, DISABLED, USER_GROUP } from "./constants";
import { agencyBodyRender, buildObjectWithIds, buildUsersQuery, getFilters } from "./utils";

const Container = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const canAddUsers = usePermissions(NAMESPACE, CREATE_RECORDS);
  const canListAgencies = usePermissions(RESOURCES.agencies, READ_RECORDS);
  const recordType = "users";

  const agencies = useMemoizedSelector(state => selectAgencies(state));
  const enabledAgencies = useMemoizedSelector(state => getEnabledAgencies(state));
  const filterUserGroups = useMemoizedSelector(state => getEnabledUserGroups(state));
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));

  const agenciesWithId = buildObjectWithIds(agencies);

  const columns = LIST_HEADERS.map(({ label, ...rest }) => ({
    label: i18n.t(label),
    ...rest,
    ...(rest.name === "agency_id"
      ? { options: { customBodyRender: value => agencyBodyRender(i18n, agenciesWithId, value) } }
      : {})
  }));

  const defaultFilters = metadata.set(DISABLED, fromJS(["false"]));

  useEffect(() => {
    if (canListAgencies) {
      dispatch(fetchAgencies({ options: { per: 999 } }));
    }
    dispatch(fetchUserGroups());
  }, []);

  useMetadata(recordType, metadata, fetchUsers, "data");

  const tableOptions = {
    recordType,
    columns,
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange: fetchUsers,
    bypassInitialFetch: true
  };

  const newUserBtn = canAddUsers && (
    <ActionButton
      icon={<AddIcon />}
      text={i18n.t("buttons.new")}
      type={ACTION_BUTTON_TYPES.default}
      rest={{
        to: ROUTES.admin_users_new,
        component: Link
      }}
    />
  );

  const filterPermission = {
    agency: canListAgencies
  };

  const filterProps = {
    clearFields: [AGENCY, DISABLED, USER_GROUP],
    filters: getFilters(i18n, enabledAgencies, filterUserGroups, filterPermission),
    defaultFilters,
    onSubmit: data => {
      const filters = typeof data === "undefined" ? defaultFilters : buildUsersQuery(data);

      batch(() => {
        dispatch(setUsersFilters(filters));
        dispatch(fetchUsers({ data: { ...filters } }));
      });
    }
  };

  return (
    <>
      <PageHeading title={i18n.t("users.label")}>{newUserBtn}</PageHeading>
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <IndexTable title={i18n.t("users.label")} {...tableOptions} />
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
