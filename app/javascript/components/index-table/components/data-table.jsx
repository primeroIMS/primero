// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react-hooks/exhaustive-deps, no-param-reassign */

import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { fromJS, List } from "immutable";
import { ThemeProvider } from "@mui/material/styles";

import { dataToJS, ConditionalWrapper, useThemeHelper, useMemoizedSelector } from "../../../libs";
import { useI18n } from "../../i18n";
import { MAX_OFFLINE_ROWS_PER_PAGE, RECORD_PATH } from "../../../config";
import { ALERTS_COLUMNS } from "../../record-list/constants";
import recordListTheme from "../theme";
import { NAME } from "../config";
import { getFilters } from "../selectors";
import CustomToolbarSelect from "../custom-toolbar-select";
import { buildComponentColumns, defaultTableOptions, useTranslatedRecords } from "../utils";
import { useApp } from "../../application";

import TableLoadingIndicator from "./table-loading-indicator";

function Datatable({
  arrayColumnsToString,
  bypassInitialFetch,
  canSelectAll,
  checkOnline = false,
  columns,
  data,
  defaultFilters = fromJS({}),
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
  translateAsRecordType,
  title,
  customToolbarSelect = null,
  useReportingLocations
}) {
  const dispatch = useDispatch();
  const i18n = useI18n();
  const { online } = useApp();
  const { theme } = useThemeHelper({ overrides: recordListTheme });

  const filters = useMemoizedSelector(state => getFilters(state, recordType));

  const hasData = !loading && Boolean(data?.size);
  const order = filters?.get("order");
  const orderBy = filters?.get("order_by");
  const componentColumns = useMemo(
    () => buildComponentColumns(typeof columns === "function" ? columns(data) : columns, order, orderBy),
    [columns, data, order, orderBy, i18n]
  );
  const columnsName = useMemo(() => componentColumns.map(col => col.name), [componentColumns]);

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
    RECORD_PATH.registry_records,
    RECORD_PATH.families
  ].includes(translateAsRecordType || recordType);

  const translatedRecords = useTranslatedRecords({
    records,
    arrayColumnsToString,
    localizedFields,
    columnsName,
    validRecordTypes,
    useReportingLocations,
    recordType: translateAsRecordType || recordType
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

  const currentPage = page - 1;

  const selectedRecordsOnCurrentPage =
    selectedRecords && Object.keys(selectedRecords).length && selectedRecords[currentPage];

  // eslint-disable-next-line react/no-multi-comp, react/display-name
  const componentCustomToolbarSelect =
    customToolbarSelect ||
    ((selectedRows, displayData) => (
      <CustomToolbarSelect
        displayData={displayData}
        recordType={recordType}
        perPage={per}
        selectedRecords={selectedRecords}
        selectedRows={selectedRows}
        setSelectedRecords={setSelectedRecords}
        totalRecords={total}
        page={page}
        fetchRecords={onTableChange}
        selectedFilters={defaultFilters.merge(filters)}
        canSelectAll={canSelectAll}
      />
    ));

  const options = {
    ...defaultTableOptions({
      currentPage,
      customToolbarSelect: componentCustomToolbarSelect,
      handleTableChange,
      i18n,
      per: !online && per > MAX_OFFLINE_ROWS_PER_PAGE ? MAX_OFFLINE_ROWS_PER_PAGE : per,
      selectedRecords,
      selectedRecordsOnCurrentPage,
      setSelectedRecords,
      showCustomToolbar,
      sortDir,
      title,
      total,
      online
    }),
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
    customToolbarSelect: componentCustomToolbarSelect,
    ...tableOptionsProps
  };

  const tableData = useMemo(
    () => (validRecordTypes || localizedFields ? dataToJS(translatedRecords) : dataToJS(records)),
    [records, validRecordTypes, translatedRecords, localizedFields]
  );

  const rowKeys = useMemo(() => (typeof tableData?.[0] !== "undefined" ? Object.keys(tableData[0]) : []), [tableData]);

  const dataWithAlertsColumn = useMemo(() => {
    return rowKeys && rowKeys.includes(ALERTS_COLUMNS.alert_count, ALERTS_COLUMNS.flag_count)
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
  }, [tableData, rowKeys]);

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
}

Datatable.displayName = NAME;

Datatable.propTypes = {
  arrayColumnsToString: PropTypes.arrayOf(PropTypes.string),
  bypassInitialFetch: PropTypes.bool,
  canSelectAll: PropTypes.bool,
  checkOnline: PropTypes.bool,
  columns: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.array]),
  customToolbarSelect: PropTypes.func,
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
  translateAsRecordType: PropTypes.string,
  useReportingLocations: PropTypes.bool
};

export default Datatable;
