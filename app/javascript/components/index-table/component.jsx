/* eslint-disable react-hooks/exhaustive-deps, no-param-reassign */
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import uniqBy from "lodash/uniqBy";
import isEmpty from "lodash/isEmpty";
import startsWith from "lodash/startsWith";
import { List, fromJS } from "immutable";
import { ThemeProvider } from "@material-ui/styles";

import { compare, dataToJS, ConditionalWrapper } from "../../libs";
import LoadingIndicator from "../loading-indicator";
import { getFields } from "../record-list/selectors";
import { getOptions, getLoadingState } from "../record-form/selectors";
import { selectAgencies } from "../application/selectors";
import { useI18n } from "../i18n";
import {
  STRING_SOURCES_TYPES,
  RECORD_PATH,
  ROWS_PER_PAGE_OPTIONS
} from "../../config";
import { ALERTS_COLUMNS } from "../record-list/constants";

import recordListTheme from "./theme";
import { NAME } from "./config";
import { getRecords, getLoading, getErrors, getFilters } from "./selectors";
import CustomToolbarSelect from "./custom-toolbar-select";

const Component = ({
  columns,
  recordType,
  onTableChange,
  defaultFilters,
  options: tableOptionsProps,
  targetRecordType,
  onRowClick,
  bypassInitialFetch,
  selectedRecords,
  setSelectedRecords,
  localizedFields,
  showCustomToolbar
}) => {
  const dispatch = useDispatch();
  const i18n = useI18n();
  const [sortDir, setSortDir] = useState();
  const data = useSelector(state => getRecords(state, recordType), compare);
  const loading = useSelector(state => getLoading(state, recordType));
  const errors = useSelector(state => getErrors(state, recordType));
  const filters = useSelector(state => getFilters(state, recordType), compare);

  const { order, order_by: orderBy } = filters || {};
  const records = data.get("data");
  const per = data.getIn(["metadata", "per"], 20);
  const total = data.getIn(["metadata", "total"], 0);
  const page = data.getIn(["metadata", "page"], 1);
  const url = targetRecordType || recordType;
  const validRecordTypes = [
    RECORD_PATH.cases,
    RECORD_PATH.incidents,
    RECORD_PATH.tracing_requests
  ].includes(recordType);
  let translatedRecords = [];

  const allFields = useSelector(state => getFields(state), compare);
  const allLookups = useSelector(state => getOptions(state), compare);
  const allAgencies = useSelector(state => selectAgencies(state), compare);

  let componentColumns =
    typeof columns === "function" ? columns(data) : columns;

  if (allFields.size && records && validRecordTypes) {
    const columnsName = componentColumns.toJS().map(col => col.name);

    const fieldWithColumns = allFields.toSeq().filter(fieldName => {
      if (
        columnsName.includes(fieldName.get("name")) &&
        !isEmpty(fieldName.get("option_strings_source"))
      ) {
        return fieldName;
      }

      return null;
    });

    const columnsWithLookups = uniqBy(
      fieldWithColumns.toList().toJS(),
      "option_strings_source"
    );

    translatedRecords = records.reduce((accum, record) => {
      const result = record.mapEntries(recordEntry => {
        const [key, value] = recordEntry;

        if (
          columnsWithLookups
            .map(columnWithLookup => columnWithLookup.name)
            .includes(key)
        ) {
          const optionStringsSource = columnsWithLookups.find(
            el => el.name === key
          ).option_strings_source;

          let recordValue = value;

          if (startsWith(optionStringsSource, "lookup")) {
            const lookupName = optionStringsSource.replace(/lookup /, "");

            const valueFromLookup =
              value && allLookups?.size
                ? allLookups
                    .find(lookup => lookup.get("unique_id") === lookupName)
                    .get("values")
                    .find(v => v.get("id") === value)
                    .get("display_text")
                : null;

            recordValue = valueFromLookup
              ? valueFromLookup.get(i18n.locale)
              : "";
          } else {
            switch (optionStringsSource) {
              case STRING_SOURCES_TYPES.AGENCY:
                recordValue = allAgencies
                  .find(a => a.get("id") === value)
                  .get("name");
                break;
              default:
                recordValue = value;
                break;
            }
          }

          return [key, recordValue];
        }

        return [key, value];
      });

      return accum.push(result);
    }, List());
  }

  if (localizedFields && records) {
    translatedRecords = records.map(current => {
      const translatedFields = localizedFields.reduce((acc, field) => {
        const translatedValue = current.getIn([field, i18n.locale], fromJS({}));

        return acc.merge({
          [field]:
            field === "values"
              ? current
                  .get(field)
                  .map(value => value.getIn(["display_text", i18n.locale], ""))
                  .join(", ")
              : translatedValue
        });
      }, fromJS({}));

      return current.merge(translatedFields);
    });
  }

  useEffect(() => {
    if (!bypassInitialFetch) {
      dispatch(
        onTableChange({
          recordType,
          data: { per, ...defaultFilters.merge(filters).toJS() }
        })
      );
    }
  }, [columns]);

  if (order && orderBy) {
    const sortedColumn = componentColumns.findIndex(c => c.name === orderBy);

    if (sortedColumn) {
      componentColumns = componentColumns.setIn(
        [sortedColumn, "options", "sortOrder"],
        order
      );
    }
  }

  const selectedFilters = (options, action, tableState) => {
    const { sortOrder } = tableState;

    return {
      ...options,
      ...(() => {
        switch (action) {
          case "sort": {
            const customSortFields = {
              photo: "has_photo"
            };
            const { direction, name } = sortOrder;

            options.order = direction;

            setSortDir(sortOrder);
            options.order_by = Object.keys(customSortFields).includes(name)
              ? customSortFields[name]
              : name;
            options.page = page === 0 ? 1 : page;
            break;
          }
          case "changePage":
            options.page = tableState.page >= page ? page + 1 : page - 1;
            break;
          default:
            break;
        }
      })()
    };
  };

  const handleTableChange = (action, tableState) => {
    const options = { ...defaultFilters.merge(filters).toJS() };
    const validActions = ["sort", "changeRowsPerPage", "changePage"];
    const { rowsPerPage } = tableState;

    options.per = rowsPerPage;

    if (validActions.includes(action)) {
      dispatch(
        onTableChange({
          recordType,
          data: selectedFilters(options, action, tableState)
        })
      );
    }
  };

  const currentPage = page - 1;

  const selectedRecordsOnCurrentPage =
    selectedRecords &&
    Object.keys(selectedRecords).length &&
    selectedRecords[currentPage];

  // eslint-disable-next-line react/no-multi-comp, react/display-name
  const customToolbarSelect = (selectedRows, displayData) => (
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
      selectedFilters={selectedFilters}
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
    customToolbar: showCustomToolbar && customToolbarSelect,
    selectableRows: "multiple",
    rowsSelected: selectedRecordsOnCurrentPage?.length
      ? selectedRecordsOnCurrentPage
      : [],
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
      setSelectedRecords({
        [currentPage]: allRowsSelected.map(ars => ars.dataIndex)
      });
    },
    onColumnSortChange: () => selectedRecords && setSelectedRecords({}),
    onTableChange: handleTableChange,
    rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
    page: currentPage,
    enableNestedDataAccess: ".",
    sortOrder: sortDir,
    onCellClick: (colData, cellMeta) => {
      const { dataIndex } = cellMeta;

      if (!(colData instanceof Object)) {
        if (onRowClick) {
          onRowClick(records.get(dataIndex));
        } else {
          dispatch(push(`${url}/${records.getIn([dataIndex, "id"])}`));
        }
      }
    },
    customToolbarSelect,
    ...tableOptionsProps
  };

  const tableData =
    validRecordTypes || localizedFields
      ? dataToJS(translatedRecords)
      : dataToJS(records);

  const rowKeys =
    typeof tableData?.[0] !== "undefined" ? Object.keys(tableData[0]) : [];

  const dataWithAlertsColumn =
    rowKeys &&
    rowKeys.includes(ALERTS_COLUMNS.alert_count, ALERTS_COLUMNS.flag_count)
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

  const tableOptions = {
    columns: componentColumns,
    options,
    data: dataWithAlertsColumn
  };

  const formsAreLoading = useSelector(state => getLoadingState(state));
  const dataIsLoading = loading || formsAreLoading || !allLookups.size > 0;

  const loadingIndicatorProps = {
    overlay: true,
    hasData: !dataIsLoading && Boolean(records?.size),
    type: targetRecordType || recordType,
    loading: dataIsLoading,
    errors,
    fromTableList: true
  };

  return (
    <LoadingIndicator {...loadingIndicatorProps}>
      <ConditionalWrapper
        condition={validRecordTypes}
        wrapper={ThemeProvider}
        theme={recordListTheme}
      >
        <MUIDataTable {...tableOptions} />
      </ConditionalWrapper>
    </LoadingIndicator>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  bypassInitialFetch: false,
  showCustomToolbar: false
};

Component.propTypes = {
  bypassInitialFetch: PropTypes.bool,
  columns: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  defaultFilters: PropTypes.object,
  localizedFields: PropTypes.arrayOf(PropTypes.string),
  onRowClick: PropTypes.func,
  onTableChange: PropTypes.func.isRequired,
  options: PropTypes.object,
  recordType: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  selectedRecords: PropTypes.object,
  setSelectedRecords: PropTypes.func,
  showCustomToolbar: PropTypes.bool,
  targetRecordType: PropTypes.string
};

export default Component;
