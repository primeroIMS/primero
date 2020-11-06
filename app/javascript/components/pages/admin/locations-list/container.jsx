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
import Menu from "../../../menu";
import { useMetadata } from "../../../records";
import { useDialog } from "../../../action-dialog";
import { getOptions } from "../../../form/selectors";

import { fetchLocations } from "./action-creators";
import { DISABLED, NAME, COLUMNS, LOCATION_TYPE_LOOKUP, LOCATIONS_DIALOG } from "./constants";
import ImportDialog from "./import-dialog";
import { getColumns, getFilters } from "./utils";

const Container = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const recordType = ["admin", RESOURCES.locations];
  const headers = useSelector(state => getListHeaders(state, RESOURCES.locations));
  const locationTypes = useSelector(state => getOptions(state, LOCATION_TYPE_LOOKUP, i18n));
  const metadata = useSelector(state => getMetadata(state, recordType));
  const defaultMetadata = metadata?.toJS();

  const defaultFilterFields = {
    [DISABLED]: ["false"]
  };
  const defaultFilters = fromJS({
    ...defaultFilterFields,
    ...defaultMetadata
  });
  const { setDialog, pending, dialogOpen, dialogClose } = useDialog(LOCATIONS_DIALOG);
  const columns = headersToColumns(headers, i18n);

  const handleDialogClick = dialog => {
    setDialog({ dialog, open: true });
  };

  useMetadata(recordType, metadata, fetchLocations, "data", { defaultFilterFields, defaultMetadata });

  const tableOptions = {
    recordType,
    columns: getColumns(columns, locationTypes),
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange: fetchLocations,
    localizedFields: [COLUMNS.NAME],
    bypassInitialFetch: true,
    arrayColumnsToString: [COLUMNS.HIERARCHY],
    targetRecordType: RESOURCES.locations,
    onRowClick: () => {}
  };

  const filterProps = {
    clearFields: [DISABLED],
    filters: getFilters(i18n),
    onSubmit: data => dispatch(fetchLocations({ data })),
    defaultFilters
  };

  const actions = [
    {
      id: 1,
      disableOffline: false,
      name: i18n.t("buttons.import"),
      action: () => handleDialogClick(LOCATIONS_DIALOG)
    }
  ];

  return (
    <>
      <PageHeading title={i18n.t("settings.navigation.locations")}>
        <Menu showMenu actions={actions} disabledCondtion={() => {}} />
      </PageHeading>
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <ImportDialog i18n={i18n} open={dialogOpen} pending={pending} close={dialogClose} />
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
