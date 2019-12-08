/* eslint-disable react-hooks/exhaustive-deps */
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";

import { dataToJS } from "../../libs";
import { LoadingIndicator } from "../loading-indicator";

import { NAME } from "./config";
import { getRecords, getLoading, getErrors, getFilters } from "./selectors";

const Component = ({
  columns,
  recordType,
  onTableChange,
  defaultFilters,
  options: tableOptionsProps,
  targetRecordType,
  onRowClick,
  bypassInitialFetch
}) => {
  const dispatch = useDispatch();
  const data = useSelector(state => getRecords(state, recordType));
  const loading = useSelector(state => getLoading(state, recordType));
  const errors = useSelector(state => getErrors(state, recordType));
  const filters = useSelector(state => getFilters(state, recordType));

  const { order, order_by: orderBy } = filters || {};
  const records = data.get("data");
  const per = data.getIn(["metadata", "per"], 20);
  const total = data.getIn(["metadata", "total"], 0);
  const page = data.getIn(["metadata", "page"], 1);
  const url = targetRecordType || recordType;

  let componentColumns =
    typeof columns === "function" ? columns(data) : columns;

  useEffect(() => {
    if (!bypassInitialFetch) {
      dispatch(
        onTableChange({
          recordType,
          options: { per, ...defaultFilters.merge(filters).toJS() }
        })
      );
    }
  }, [columns]);

  if (order && orderBy) {
    const sortedColumn = componentColumns.findIndex(c => c.name === orderBy);

    if (sortedColumn) {
      componentColumns = componentColumns.setIn(
        [sortedColumn, "options", "sortDirection"],
        order
      );
    }
  }

  const handleTableChange = (action, tableState) => {
    const options = { ...defaultFilters.merge(filters).toJS() };
    const validActions = ["sort", "changeRowsPerPage", "changePage"];
    const { activeColumn, columns: tableColumns, rowsPerPage } = tableState;

    options.per = rowsPerPage;

    const selectedFilters = {
      ...options,
      ...(() => {
        switch (action) {
          case "sort":
            if (typeof sortOrder === "undefined") {
              options.order = tableColumns[activeColumn].sortDirection;
            } else {
              options.order =
                order === tableColumns[activeColumn].sortDirection
                  ? "asc"
                  : "desc";
            }
            options.order_by = tableColumns[activeColumn].name;
            options.page = page === 0 ? 1 : page;
            break;
          case "changePage":
            options.page = tableState.page >= page ? page + 1 : page - 1;
            break;
          default:
            break;
        }
      })()
    };

    if (validActions.includes(action)) {
      dispatch(onTableChange({ recordType, options: selectedFilters }));
    }
  };

  const options = {
    responsive: "stacked",
    count: total,
    rowsPerPage: per,
    rowHover: true,
    filterType: "checkbox",
    fixedHeader: false,
    elevation: 3,
    filter: false,
    download: false,
    search: false,
    print: false,
    viewColumns: false,
    serverSide: true,
    customToolbar: () => null,
    customToolbarSelect: () => null,
    onTableChange: handleTableChange,
    rowsPerPageOptions: [20, 50, 75, 100],
    page: page - 1,
    onRowClick: (rowData, rowMeta) => {
      if (onRowClick) {
        onRowClick(records.get(rowMeta.dataIndex));
      } else {
        dispatch(push(`${url}/${records.getIn([rowMeta.dataIndex, "id"])}`));
      }
    },
    ...tableOptionsProps
  };

  const tableOptions = {
    columns: componentColumns,
    options,
    data: dataToJS(records)
  };

  const loadingIndicatorProps = {
    overlay: true,
    hasData: !!records,
    type: recordType,
    loading,
    errors
  };

  const DataTable = () => (
    <LoadingIndicator {...loadingIndicatorProps}>
      <MUIDataTable {...tableOptions} />
    </LoadingIndicator>
  );

  return <DataTable />;
};

Component.displayName = NAME;

Component.defaultProps = {
  bypassInitialFetch: false
};

Component.propTypes = {
  bypassInitialFetch: PropTypes.bool,
  columns: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  defaultFilters: PropTypes.object,
  onRowClick: PropTypes.func,
  onTableChange: PropTypes.func.isRequired,
  options: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  targetRecordType: PropTypes.string
};

export default Component;
