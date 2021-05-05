import { useDispatch } from "react-redux";
import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { getListHeaders } from "../../../user";
import { RESOURCES, MANAGE } from "../../../../libs/permissions";
import { headersToColumns, onSubmitFilters } from "../utils";
import { FiltersForm } from "../../../form-filters/components";
import { getMetadata } from "../../../record-list";
import Menu from "../../../menu";
import { useMetadata } from "../../../records";
import { useDialog } from "../../../action-dialog";
import { getOptions } from "../../../form/selectors";
import { useMemoizedSelector } from "../../../../libs";
import Permission from "../../../application/permission";
import InternalAlert, { SEVERITY } from "../../../internal-alert";
import { getLocationsAvailable } from "../../../application/selectors";
import { DEFAULT_DISABLED_FILTER, DATA } from "../constants";

import ImportDialog from "./import-dialog";
import { fetchLocations } from "./action-creators";
import { DISABLED, NAME, COLUMNS, LOCATION_TYPE_LOOKUP, LOCATIONS_DIALOG } from "./constants";
import { getColumns, getFilters } from "./utils";

const Container = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const recordType = ["admin", RESOURCES.locations];

  const headers = useMemoizedSelector(state => getListHeaders(state, RESOURCES.locations));
  const locationTypes = useMemoizedSelector(state => getOptions(state, LOCATION_TYPE_LOOKUP, i18n));
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));
  const hasLocationsAvailable = useMemoizedSelector(state => getLocationsAvailable(state));

  const defaultFilters = metadata.merge(DEFAULT_DISABLED_FILTER);

  const { setDialog, pending, dialogOpen, dialogClose } = useDialog(LOCATIONS_DIALOG);
  const columns = headersToColumns(headers, i18n);

  const handleDialogClick = dialog => {
    setDialog({ dialog, open: true });
  };

  useMetadata(recordType, metadata, fetchLocations, DATA, {
    defaultFilterFields: DEFAULT_DISABLED_FILTER
  });

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

  const onSubmit = data => onSubmitFilters(data)(dispatch, fetchLocations);

  const filterProps = {
    clearFields: [DISABLED],
    filters: getFilters(i18n),
    onSubmit,
    defaultFilters,
    initialFilters: DEFAULT_DISABLED_FILTER
  };

  const actions = [
    {
      id: 1,
      disableOffline: false,
      name: i18n.t("buttons.import"),
      action: () => handleDialogClick(LOCATIONS_DIALOG)
    }
  ];
  const itemsForAlert = fromJS([{ message: i18n.t("location.no_location") }]);
  const renderAlertNoLocations = !hasLocationsAvailable && (
    <InternalAlert items={itemsForAlert} severity={SEVERITY.info} />
  );

  return (
    <Permission resources={RESOURCES.metadata} actions={MANAGE} redirect>
      <PageHeading title={i18n.t("settings.navigation.locations")}>
        <Menu showMenu actions={actions} />
      </PageHeading>
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <ImportDialog i18n={i18n} open={dialogOpen} pending={pending} close={dialogClose} />
            {renderAlertNoLocations}
            <IndexTable title={i18n.t("location.label")} {...tableOptions} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FiltersForm {...filterProps} />
          </Grid>
        </Grid>
      </PageContent>
    </Permission>
  );
};

Container.displayName = NAME;

Container.propTypes = {};

export default Container;
