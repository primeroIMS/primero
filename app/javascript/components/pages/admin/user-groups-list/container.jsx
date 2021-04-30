import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { useDispatch } from "react-redux";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { usePermissions, getListHeaders } from "../../../user";
import NAMESPACE from "../namespace";
import { CREATE_RECORDS, RESOURCES } from "../../../../libs/permissions";
import { getMetadata } from "../../../record-list";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { useMetadata } from "../../../records";
import { useMemoizedSelector } from "../../../../libs";
import { FiltersForm } from "../../../form-filters/components";
import { getFilters } from "../agencies-list/utils";
import { DEFAULT_DISABLED_FILTER, DISABLED, DATA } from "../constants";
import { onSubmitFilters } from "../utils";

import { NAME } from "./constants";
import { fetchUserGroups } from "./action-creators";

const Container = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const canAddUserGroups = usePermissions(NAMESPACE, CREATE_RECORDS);

  const recordType = RESOURCES.user_groups;

  const headers = useMemoizedSelector(state => getListHeaders(state, RESOURCES.user_groups));
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));

  const defaultFilters = metadata.merge(DEFAULT_DISABLED_FILTER);

  const columns = headers.map(({ name, field_name: fieldName, ...rest }) => ({
    label: i18n.t(name),
    name: fieldName,
    ...rest
  }));

  useMetadata(recordType, metadata, fetchUserGroups, DATA, { defaultFilterFields: DEFAULT_DISABLED_FILTER });

  const onSubmit = data => onSubmitFilters(data)(dispatch, fetchUserGroups);

  const filterProps = {
    clearFields: [DISABLED],
    filters: getFilters(i18n),
    onSubmit,
    defaultFilters,
    initialFilters: DEFAULT_DISABLED_FILTER
  };

  const tableOptions = {
    recordType,
    columns,
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange: fetchUserGroups,
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
