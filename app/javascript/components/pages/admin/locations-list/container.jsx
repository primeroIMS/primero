import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { getListHeaders } from "../../../user";
import { RESOURCES } from "../../../../libs/permissions";
import { headersToColumns } from "../utils";
import { Filters as AdminFilters } from "../components";
import { getMetadata } from "../../../record-list";
import { useMetadata } from "../../../records";

import { fetchLocations } from "./action-creators";
import { NAME, DISABLED } from "./constants";
import { getFilters } from "./utils";

const Container = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const recordType = ["admin", RESOURCES.locations];
  const headers = useSelector(state => getListHeaders(state, RESOURCES.locations));

  const metadata = useSelector(state => getMetadata(state, recordType));
  const defaultMetadata = metadata?.toJS();
  const defaultFilterFields = {
    [DISABLED]: ["false"]
  };
  const defaultFilters = fromJS({
    ...defaultFilterFields,
    ...defaultMetadata
  });
  const columns = headersToColumns(headers, i18n);

  useMetadata(recordType, metadata, fetchLocations, "data", { defaultFilterFields });

  const tableOptions = {
    recordType,
    columns,
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange: fetchLocations,
    localizedFields: ["name"],
    bypassInitialFetch: true,
    arrayColumnsToString: ["hierarchy"],
    targetRecordType: "locations"
  };

  const filterProps = {
    clearFields: [DISABLED],
    filters: getFilters(i18n),
    onSubmit: data => dispatch(fetchLocations({ data })),
    defaultFilters
  };

  return (
    <>
      <PageHeading title={i18n.t("location.label")} />
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <IndexTable title={i18n.t("location.label")} {...tableOptions} />
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
