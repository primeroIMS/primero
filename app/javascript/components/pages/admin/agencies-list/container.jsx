import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { usePermissions, getListHeaders } from "../../../user";
import { CREATE_RECORDS, RESOURCES } from "../../../../libs/permissions";
import { headersToColumns } from "../utils";
import { Filters as AdminFilters } from "../components";
import { getMetadata } from "../../../record-list";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";

import { fetchAgencies } from "./action-creators";
import { NAME, DISABLED } from "./constants";
import { getFilters } from "./utils";
import NAMESPACE from "./namespace";

const Container = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const canAddAgencies = usePermissions(NAMESPACE, CREATE_RECORDS);
  const recordType = RESOURCES.agencies;
  const headers = useSelector(state =>
    getListHeaders(state, RESOURCES.agencies)
  );

  const metadata = useSelector(state => getMetadata(state, recordType));
  const defaultFilters = fromJS({
    ...{
      [DISABLED]: ["false"]
    },
    ...metadata?.toJS()
  });

  const columns = headersToColumns(headers, i18n);

  useEffect(() => {
    dispatch(fetchAgencies({ data: defaultFilters.toJS() }));
  }, []);

  const tableOptions = {
    recordType,
    columns,
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange: fetchAgencies,
    localizedFields: ["name", "description"],
    bypassInitialFetch: true
  };

  const filterProps = {
    clearFields: [DISABLED],
    filters: getFilters(i18n),
    onSubmit: data => dispatch(fetchAgencies({ data })),
    defaultFilters
  };

  const newAgencyBtn = canAddAgencies ? (
    <ActionButton
      icon={<AddIcon />}
      text={i18n.t("buttons.new")}
      type={ACTION_BUTTON_TYPES.default}
      rest={{
        to: ROUTES.admin_agencies_new,
        component: Link
      }}
    />
  ) : null;

  return (
    <>
      <PageHeading title={i18n.t("agencies.label")}>{newAgencyBtn}</PageHeading>
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <IndexTable title={i18n.t("agencies.label")} {...tableOptions} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <AdminFilters {...filterProps} />
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {};

export default Container;
