import React, { useEffect } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { fromJS } from "immutable";
import { Button, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { usePermissions } from "../../../user";
import NAMESPACE from "../namespace";
import { CREATE_RECORDS } from "../../../../libs/permissions";
import { Filters as AdminFilters } from "../components";
import { fetchAgencies } from "../agencies-list/action-creators";
import { getEnabledAgencies } from "../../../application/selectors";
import { useThemeHelper } from "../../../../libs";
import styles from "../styles.css";
import ButtonText from "../../../button-text";

import { fetchUsers, setUsersFilters } from "./action-creators";
import { LIST_HEADERS, AGENCY, DISABLED } from "./constants";
import { buildUsersQuery, getFilters } from "./utils";

const Container = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const canAddUsers = usePermissions(NAMESPACE, CREATE_RECORDS);
  const recordType = "users";
  const { css } = useThemeHelper(styles);

  const columns = LIST_HEADERS.map(({ label, ...rest }) => ({
    label: i18n.t(label),
    ...rest
  }));
  const filterAgencies = useSelector(state => getEnabledAgencies(state));

  useEffect(() => {
    dispatch(fetchAgencies({ options: { per: 999 } }));
    dispatch(fetchUsers({ data: { [DISABLED]: ["false"] } }));
  }, []);

  const tableOptions = {
    recordType,
    columns,
    options: {
      selectableRows: "none"
    },
    defaultFilters: fromJS({
      per: 20,
      page: 1
    }),
    onTableChange: fetchUsers,
    bypassInitialFetch: true
  };

  const newUserBtn = canAddUsers && (
    <Button
      to={ROUTES.admin_users_new}
      component={Link}
      color="primary"
      className={css.showActionButton}
    >
      <AddIcon />
      <ButtonText text={i18n.t("buttons.new")} />
    </Button>
  );

  const filterProps = {
    clearFields: [AGENCY, DISABLED],
    filters: getFilters(i18n, filterAgencies),
    defaultFilters: {
      [DISABLED]: ["false"]
    },
    onSubmit: data => {
      const filters = buildUsersQuery(data);

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
