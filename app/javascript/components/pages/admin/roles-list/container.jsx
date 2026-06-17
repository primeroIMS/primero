import { useEffect } from "react";
import { fromJS, List } from "immutable";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { useDispatch } from "react-redux";

import { FILTER_TYPES } from "../../../index-filters";
import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { NAMESPACE } from "../roles-form";
import { getAppliedFilters, getMetadata } from "../../../record-list";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { usePermissions, RESOURCES, CREATE_RECORDS } from "../../../permissions";
import { useMetadata } from "../../../records";
import { getSystemPermissions, useApp } from "../../../application";
import { useMemoizedSelector } from "../../../../libs";
import { FiltersForm } from "../../../form-filters/components";
import { DEFAULT_FILTERS, DATA, DISABLED, GROUP_PERMISSION } from "../constants";
import { filterOnTableChange, getFilters, onSubmitFilters } from "../utils";

import { fetchRoles, setRolesFilter } from "./action-creators";
import { ADMIN_NAMESPACE, LIST_HEADERS, NAME } from "./constants";

function Container() {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { limitedProductionSite } = useApp();
  const recordType = RESOURCES.roles;

  const columns = LIST_HEADERS.map(({ label, ...rest }) => ({
    label: i18n.t(label),
    ...rest
  }));
  const metadata = useMemoizedSelector(state => getMetadata(state, "roles"));
  const currentFilters = useMemoizedSelector(state => getAppliedFilters(state, [ADMIN_NAMESPACE, NAMESPACE]));
  const systemPermissions = useMemoizedSelector(state => getSystemPermissions(state));

  const defaultFilters = fromJS(DEFAULT_FILTERS).merge(metadata);
  const canAddRoles = usePermissions(NAMESPACE, CREATE_RECORDS);
  const rolesNewButton = canAddRoles && (
    <ActionButton
      icon={<AddIcon />}
      text="buttons.new"
      type={ACTION_BUTTON_TYPES.default}
      rest={{
        to: ROUTES.admin_roles_new,
        component: Link,
        hide: limitedProductionSite
      }}
    />
  );

  useMetadata(recordType, metadata, fetchRoles, DATA, {
    defaultFilterFields: DEFAULT_FILTERS,
    includeQueryParams: true
  });

  const permissions = systemPermissions.get("management", fromJS([])).reduce((acc, permission) => {
    acc.push({
      id: permission,
      display_name: i18n.t(`permissions.resource.group.actions.${permission}.label`)
    });

    return acc;
  }, []);

  const onSubmit = data =>
    onSubmitFilters(currentFilters.merge(fromJS(data || DEFAULT_FILTERS)), dispatch, fetchRoles, setRolesFilter);

  const onTableChange = filterOnTableChange(dispatch, fetchRoles, setRolesFilter);

  const filterProps = {
    clearFields: [DISABLED, GROUP_PERMISSION],
    filters: [
      ...getFilters(i18n),
      {
        name: "roles.filter_by.group_permission",
        field_name: GROUP_PERMISSION,
        options: permissions,
        type: FILTER_TYPES.MULTI_SELECT,
        multiple: true
      }
    ],
    onSubmit,
    defaultFilters,
    initialFilters: DEFAULT_FILTERS
  };

  const tableOptions = {
    recordType: [ADMIN_NAMESPACE, NAMESPACE],
    columns: List(columns),
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange,
    targetRecordType: NAMESPACE,
    bypassInitialFetch: true
  };

  useEffect(() => {
    dispatch(setRolesFilter({ data: defaultFilters }));
  }, []);

  return (
    <>
      <PageHeading title={i18n.t("roles.label")}>{rolesNewButton}</PageHeading>
      <PageContent>
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              sm: 8
            }}
          >
            <IndexTable title={i18n.t("roles.label")} {...tableOptions} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 4
            }}
          >
            <FiltersForm {...filterProps} noMargin />
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
}

Container.displayName = NAME;

export default Container;
