import { useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { fromJS } from "immutable";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { usePermissions, getListHeaders } from "../../../user";
import NAMESPACE from "../namespace";
import { CREATE_RECORDS, RESOURCES } from "../../../../libs/permissions";
import { getAppliedFilters, getMetadata } from "../../../record-list";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { useMetadata } from "../../../records";
import { useMemoizedSelector } from "../../../../libs";
import { FiltersForm } from "../../../form-filters/components";
import { getFilters } from "../agencies-list/utils";
import { DEFAULT_FILTERS, DISABLED, DATA } from "../constants";
import { filterOnTableChange, onSubmitFilters } from "../utils";

import { NAME } from "./constants";
import { fetchUserGroups, setUserGroupsFilter } from "./action-creators";

const Container = () => {
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
    clearFields: [DISABLED],
    filters: getFilters(i18n),
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
      text={i18n.t("buttons.new")}
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
          <Grid item xs={12} sm={9}>
            <IndexTable title={i18n.t("user_groups.label")} {...tableOptions} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FiltersForm {...filterProps} />
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {};

export default Container;
