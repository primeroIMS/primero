import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import React from "react";
import { dataToJS } from "libs";

const IndexTable = ({
  columns,
  data,
  onTableChange,
  defaultFilters,
  path,
  namespace,
  onRowClick,
  options: tableOptionsProps
}) => {
  const { meta, filters, records } = data;
  const per = meta ? meta.get("per") : 20;
  const total = meta ? meta.get("total") : 0;

  const handleTableChange = (action, tableState) => {
    const options = { per, ...defaultFilters.merge(filters).toJS() };
    const validActions = ["sort", "changeRowsPerPage", "changePage"];

    const {
      activeColumn,
      columns: tableColumns,
      rowsPerPage,
      page
    } = tableState;

    const selectedFilters = Object.assign(
      {},
      options,
      (() => {
        switch (action) {
          case "sort":
            options.order = tableColumns[activeColumn].sortDirection;
            options.column = tableColumns[activeColumn].name;
            break;
          case "changeRowsPerPage":
            options.per = rowsPerPage;
            break;
          case "changePage":
            options.page = page + 1;
            break;
          default:
            break;
        }
      })()
    );

    if (validActions.includes(action)) {
      onTableChange({ namespace, path, options: selectedFilters });
    }
  };

  const options = Object.assign(
    {
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
      rowsPerPageOptions: [20, 50, 75, 100]
    },
    tableOptionsProps
  );

  if (onRowClick) {
    options.onRowClick = onRowClick;
  }

  const tableOptions = {
    columns,
    options,
    data: dataToJS(records)
  };

  const DataTable = () => <MUIDataTable {...tableOptions} />;

  return <DataTable />;
};

IndexTable.propTypes = {
  onTableChange: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
  defaultFilters: PropTypes.object,
  path: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired,
  options: PropTypes.object,
  onRowClick: PropTypes.func
};

export default IndexTable;
