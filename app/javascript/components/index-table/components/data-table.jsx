/* eslint-disable react-hooks/exhaustive-deps, no-param-reassign */

import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { fromJS, List } from "immutable";
import { ThemeProvider } from "@material-ui/core/styles";

import { dataToJS, ConditionalWrapper, useThemeHelper, useMemoizedSelector } from "../../../libs";
import { useI18n } from "../../i18n";
import { RECORD_PATH, ROWS_PER_PAGE_OPTIONS } from "../../../config";
import { ALERTS_COLUMNS } from "../../record-list/constants";
import recordListTheme from "../theme";
import { NAME } from "../config";
import { getFilters } from "../selectors";
import CustomToolbarSelect from "../custom-toolbar-select";
import { buildComponentColumns, useTranslatedRecords } from "../utils";
import { useApp } from "../../application";

import TableLoadingIndicator from "./table-loading-indicator";

const Datatable = ({
  arrayColumnsToString,
  bypassInitialFetch,
  canSelectAll,
  checkOnline = false,
  columns,
  data,
  defaultFilters,
  errors,
  isRowSelectable,
  loading,
  loadingIndicatorType,
  localizedFields,
  onRowClick,
  onTableChange,
  options: tableOptionsProps,
  recordType,
  selectedRecords,
  setSelectedRecords,
  showCustomToolbar,
  targetRecordType,
  title,
  useReportingLocations
}) => {
  const dispatch = useDispatch();
  const i18n = useI18n();
  const { online } = useApp();
  const { theme } = useThemeHelper({ overrides: recordListTheme });

  const internalTableState = useRef({});
  const filters = useMemoizedSelector(state => getFilters(state, recordType));

  const hasData = !loading && Boolean(data?.size);
  const order = filters.get("order");
  const orderBy = filters.get("order_by");
  const componentColumns = buildComponentColumns(
    typeof columns === "function" ? columns(data) : columns,
    order,
    orderBy
  );
  const columnsName = componentColumns.map(col => col.name);

  const [sortDir, setSortDir] = useState(order);

  const records = data.get("data");
  const per = data.getIn(["metadata", "per"], 20);
  const total = data.getIn(["metadata", "total"], 0);
  const page = data.getIn(["metadata", "page"], 1);
  const url = targetRecordType || recordType;
  const validRecordTypes = [
    RECORD_PATH.cases,
    RECORD_PATH.incidents,
    RECORD_PATH.tracing_requests,
    RECORD_PATH.registry_records
  ].includes(recordType);

  const translatedRecords = useTranslatedRecords({
    records,
    arrayColumnsToString,
    localizedFields,
    columnsName,
    validRecordTypes,
    useReportingLocations
  });

  useEffect(() => {
    if (!bypassInitialFetch) {
      dispatch(
        onTableChange({
          recordType,
          data: defaultFilters.merge(filters).merge(fromJS({ per }))
        })
      );
    }
  }, [columns]);

  const setOrderByParam = name => {
    const customSortFields = {
      photo: "has_photo"
    };

    if (Object.keys(customSortFields).includes(name)) {
      return customSortFields[name];
    }

    if (name === "complete" && online) {
      return undefined;
    }

    return name;
  };

  const selectedFilters = (options, action, tableState) => {
    const { sortOrder } = tableState;

    switch (action) {
      case "sort": {
        const { direction, name } = sortOrder;
        const orderByParam = setOrderByParam(name);
        const defaultOptions = options.set("page", page === 0 ? 1 : page);

        setSortDir(sortOrder);

        if (orderByParam) {
          return defaultOptions.set("order", direction).set("order_by", orderByParam);
        }

        return defaultOptions;
      }
      case "changePage":
        return options.set("page", tableState.page >= page ? page + 1 : page - 1);
      default:
        return options;
    }
  };

  const handleTableChange = (action, tableState) => {
    internalTableState.current = tableState;
    const options = defaultFilters.merge(filters);
    const validActions = ["sort", "changeRowsPerPage", "changePage"];
    const { rowsPerPage } = tableState;

    if (action === "changeRowsPerPage") {
      tableState.page = page - 1;
    }

    if (validActions.includes(action)) {
      dispatch(
        onTableChange({
          recordType,
          data: selectedFilters(options.set("per", rowsPerPage), action, tableState)
        })
      );
    }
  };

  const handleTableInit = (_action, tableState) => {
    internalTableState.current = tableState;
  };

  const currentPage = page - 1;

  const selectedRecordsOnCurrentPage =
    selectedRecords && Object.keys(selectedRecords).length && selectedRecords[currentPage];

  // eslint-disable-next-line react/no-multi-comp, react/display-name
  const customToolbarSelect = (selectedRows, displayData) => (
    <CustomToolbarSelect
      displayData={displayData}
      recordType={recordType}
      perPage={internalTableState.current?.rowsPerPage || 20}
      selectedRecords={selectedRecords}
      selectedRows={selectedRows}
      setSelectedRecords={setSelectedRecords}
      totalRecords={internalTableState.current?.count}
      page={internalTableState.current?.page}
      fetchRecords={onTableChange}
      selectedFilters={defaultFilters.merge(filters)}
      canSelectAll={canSelectAll}
    />
  );

  const options = {
    responsive: "vertical",
    count: total,
    rowsPerPage: per,
    rowHover: true,
    filterType: "checkbox",
    fixedHeader: true,
    elevation: 3,
    filter: false,
    download: false,
    search: false,
    print: false,
    viewColumns: false,
    serverSide: true,
    setTableProps: () => ({ "aria-label": title }),
    customToolbar: showCustomToolbar && customToolbarSelect,
    selectableRows: "multiple",
    rowsSelected: selectedRecordsOnCurrentPage?.length ? selectedRecordsOnCurrentPage : [],
    onRowSelectionChange: (_currentRowsSelected, allRowsSelected) => {
      setSelectedRecords({
        [currentPage]: allRowsSelected.map(ars => ars.dataIndex)
      });
    },
    onTableChange: handleTableChange,
    onTableInit: handleTableInit,
    rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
    page: currentPage,
    enableNestedDataAccess: ".",
    sortOrder: sortDir,
    isRowSelectable: dataIndex => {
      if (isRowSelectable) {
        return isRowSelectable(records.get(dataIndex));
      }

      return true;
    },
    onCellClick: (colData, cellMeta) => {
      const { colIndex, dataIndex } = cellMeta;
      const cells = fromJS(componentColumns);

      if (!cells.getIn([colIndex, "options", "disableOnClick"], false) && ((checkOnline && online) || !checkOnline)) {
        if (onRowClick) {
          onRowClick(records.get(dataIndex));
        } else {
          dispatch(push(`${url}/${records.getIn([dataIndex, "id"])}`));
        }
      }
    },
    customToolbarSelect,
    textLabels: {
      body: {
        noMatch: i18n.t("messages.record_list.no_match"),
        toolTip: i18n.t("messages.record_list.sort"),
        columnHeaderTooltip: ({ label }) => i18n.t("messages.record_list.column_header_tooltip", { column: label })
      },
      pagination: {
        rowsPerPage: i18n.t("messages.record_list.rows_per_page"),
        displayRows: i18n.t("messages.record_list.of")
      }
    },
    ...tableOptionsProps
  };

  const tableData = validRecordTypes || localizedFields ? dataToJS(translatedRecords) : dataToJS(records);

  const rowKeys = typeof tableData?.[0] !== "undefined" ? Object.keys(tableData[0]) : [];

  const dataWithAlertsColumn =
    rowKeys && rowKeys.includes(ALERTS_COLUMNS.alert_count, ALERTS_COLUMNS.flag_count)
      ? tableData.map(row => ({
          ...row,
          alerts: {
            // eslint-disable-next-line camelcase
            alert_count: row?.alert_count || 0,
            // eslint-disable-next-line camelcase
            flag_count: row?.flag_count || 0
          }
        }))
      : tableData;

  const components = {
    // eslint-disable-next-line react/display-name, react/no-multi-comp
    TableBody: props => (
      <TableLoadingIndicator
        {...props}
        loading={loading}
        hasData={hasData}
        errors={errors}
        loadingIndicatorType={loadingIndicatorType}
      />
    )
  };

  return (
    <ConditionalWrapper condition={validRecordTypes} wrapper={ThemeProvider} theme={theme}>
      <MUIDataTable
        title={title}
        columns={componentColumns}
        options={options}
        data={dataWithAlertsColumn}
        components={components}
      />
    </ConditionalWrapper>
  );
};

Datatable.displayName = NAME;

Datatable.propTypes = {
  arrayColumnsToString: PropTypes.arrayOf(PropTypes.string),
  bypassInitialFetch: PropTypes.bool,
  canSelectAll: PropTypes.bool,
  checkOnline: PropTypes.bool,
  columns: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.array]),
  data: PropTypes.instanceOf(List),
  defaultFilters: PropTypes.object,
  errors: PropTypes.array,
  isRowSelectable: PropTypes.func,
  loading: PropTypes.bool,
  loadingIndicatorType: PropTypes.string,
  localizedFields: PropTypes.arrayOf(PropTypes.string),
  onRowClick: PropTypes.func,
  onTableChange: PropTypes.func.isRequired,
  options: PropTypes.object,
  recordType: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  selectedRecords: PropTypes.object,
  setSelectedRecords: PropTypes.func,
  showCustomToolbar: PropTypes.bool,
  targetRecordType: PropTypes.string,
  title: PropTypes.string,
  useReportingLocations: PropTypes.bool
};

export default Datatable;
