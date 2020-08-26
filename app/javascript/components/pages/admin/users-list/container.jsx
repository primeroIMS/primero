import React, { useEffect } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
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
import { CREATE_RECORDS } from "../../../../libs/permissions";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { Filters as AdminFilters } from "../components";
import { fetchAgencies } from "../agencies-list/action-creators";
import { getEnabledAgencies } from "../../../application/selectors";
import { getMetadata } from "../../../record-list";
import { useMetadata } from "../../../records";

import { fetchUsers, setUsersFilters } from "./action-creators";
import { LIST_HEADERS, AGENCY, DISABLED } from "./constants";
import { buildUsersQuery, getFilters } from "./utils";

const Container = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const canAddUsers = usePermissions(NAMESPACE, CREATE_RECORDS);
  const recordType = "users";

  const columns = LIST_HEADERS.map(({ label, ...rest }) => ({
    label: i18n.t(label),
    ...rest
  }));
  const filterAgencies = useSelector(state => getEnabledAgencies(state));
  const metadata = useSelector(state => getMetadata(state, recordType));
  const defaultMetadata = metadata?.toJS();
  const defaultFilterFields = {
    [DISABLED]: ["false"]
  };
  const defaultFilters = fromJS({
    ...defaultFilterFields,
    ...defaultMetadata
  });

  useEffect(() => {
    dispatch(fetchAgencies({ options: { per: 999 } }));
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

  const filterProps = {
    clearFields: [AGENCY, DISABLED],
    filters: getFilters(i18n, filterAgencies),
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
            <AdminFilters {...filterProps} />
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
};

Container.displayName = "UsersList";

Container.propTypes = {};

export default Container;
