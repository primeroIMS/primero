import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { getListHeaders } from "../../../user";
import { RESOURCES, MANAGE } from "../../../../libs/permissions";
import { filterOnTableChange, headersToColumns, onSubmitFilters } from "../utils";
import { FiltersForm } from "../../../form-filters/components";
import { getAppliedFilters, getMetadata } from "../../../record-list";
import Menu from "../../../menu";
import { useMetadata } from "../../../records";
import { useDialog } from "../../../action-dialog";
import { useMemoizedSelector } from "../../../../libs";
import Permission from "../../../application/permission";
import InternalAlert, { SEVERITY } from "../../../internal-alert";
import { getLocationsAvailable } from "../../../application/selectors";
import { DEFAULT_FILTERS, DATA } from "../constants";
import useOptions from "../../../form/use-options";

import { NAME as DisableDialogName } from "./disable-dialog/constants";
import DisableDialog from "./disable-dialog";
import ImportDialog from "./import-dialog";
import { fetchLocations, setLocationsFilter } from "./action-creators";
import { ACTION_NAME, DISABLED, NAME, COLUMNS, LOCATION_TYPE_LOOKUP, LOCATIONS_DIALOG } from "./constants";
import { getColumns, getFilters } from "./utils";

const Container = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [selectedRecords, setSelectedRecords] = useState({});
  const recordType = ["admin", RESOURCES.locations];

  const locationTypes = useOptions({ source: LOCATION_TYPE_LOOKUP });
  const headers = useMemoizedSelector(state => getListHeaders(state, RESOURCES.locations));
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));
  const hasLocationsAvailable = useMemoizedSelector(state => getLocationsAvailable(state));
  const currentFilters = useMemoizedSelector(state => getAppliedFilters(state, recordType));

  const defaultFilters = fromJS(DEFAULT_FILTERS).merge(metadata).set("locale", i18n.locale);

  const { setDialog, pending, dialogOpen, dialogClose } = useDialog(LOCATIONS_DIALOG);
  const columns = headersToColumns(headers, i18n);

  const handleDialogClick = (dialog, action) => {
    setDialog({ dialog, open: true, params: { action } });
  };

  const onTableChange = filterOnTableChange(dispatch, fetchLocations, setLocationsFilter);

  useMetadata(recordType, metadata, fetchLocations, DATA, {
    defaultFilterFields: { ...DEFAULT_FILTERS, locale: i18n.locale }
  });

  const tableOptions = {
    canSelectAll: false,
    recordType,
    columns: getColumns(columns, locationTypes),
    options: { selectableRows: "multiple" },
    defaultFilters,
    onTableChange,
    localizedFields: [COLUMNS.NAME],
    bypassInitialFetch: true,
    arrayColumnsToString: [COLUMNS.HIERARCHY],
    targetRecordType: RESOURCES.locations,
    onRowClick: () => {},
    setSelectedRecords,
    selectedRecords
  };

  const onSubmit = data =>
    onSubmitFilters(
      currentFilters.merge(fromJS(data || DEFAULT_FILTERS)).set("page", 1),
      dispatch,
      fetchLocations,
      setLocationsFilter
    );

  const filterProps = {
    clearFields: [DISABLED],
    filters: getFilters(i18n),
    onSubmit,
    defaultFilters,
    initialFilters: DEFAULT_FILTERS
  };

  const disabledCondition = action =>
    [2, 3].includes(action.id) ? isEmpty(Object.values(selectedRecords).flat()) : false;

  const actions = [
    {
      id: 1,
      disableOffline: false,
      name: i18n.t("buttons.import"),
      action: () => handleDialogClick(LOCATIONS_DIALOG)
    },
    {
      id: 2,
      disableOffline: false,
      name: i18n.t("actions.disable"),
      action: () => handleDialogClick(DisableDialogName, ACTION_NAME.disable)
    },
    {
      id: 3,
      disableOffline: false,
      name: i18n.t("actions.enable"),
      action: () => handleDialogClick(DisableDialogName, ACTION_NAME.enable)
    }
  ];
  const itemsForAlert = fromJS([{ message: i18n.t("location.no_location") }]);
  const renderAlertNoLocations = !hasLocationsAvailable && (
    <InternalAlert items={itemsForAlert} severity={SEVERITY.info} />
  );

  useEffect(() => {
    dispatch(setLocationsFilter({ data: defaultFilters }));
  }, []);

  return (
    <Permission resources={RESOURCES.metadata} actions={MANAGE} redirect>
      <PageHeading title={i18n.t("settings.navigation.locations")}>
        <Menu showMenu actions={actions} disabledCondition={disabledCondition} />
      </PageHeading>
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <ImportDialog i18n={i18n} open={dialogOpen} pending={pending} close={dialogClose} />
            <DisableDialog
              selectedRecords={selectedRecords}
              recordType={recordType}
              filters={currentFilters}
              setSelectedRecords={setSelectedRecords}
            />
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
