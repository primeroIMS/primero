import React from "react";
import { fromJS } from "immutable";
import { Button, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { usePermissions, getListHeaders } from "../../../user";
import { CREATE_RECORDS, RESOURCES } from "../../../../libs/permissions";
import { headersToColumns } from "../helper";

import { fetchAgencies } from "./action-creators";
import { NAME } from "./constants";
import NAMESPACE from "./namespace";
import { Filters } from "./components";

const Container = () => {
  const i18n = useI18n();
  const canAddAgencies = usePermissions(NAMESPACE, CREATE_RECORDS);
  const recordType = RESOURCES.agencies;

  const headers = useSelector(state =>
    getListHeaders(state, RESOURCES.agencies)
  );

  const columns = headersToColumns(headers, i18n);

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
    onTableChange: fetchAgencies,
    localizedFields: ["name", "description"]
  };

  const newAgencyBtn = canAddAgencies ? (
    <Button
      to={ROUTES.admin_agencies_new}
      component={Link}
      color="primary"
      startIcon={<AddIcon />}
    >
      {i18n.t("buttons.new")}
    </Button>
  ) : null;

  return (
    <>
      <PageHeading title={i18n.t("agencies.label")}>{newAgencyBtn}</PageHeading>
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <IndexTable {...tableOptions} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Filters />
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {};

export default Container;
