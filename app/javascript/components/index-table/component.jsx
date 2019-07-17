import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import React from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { LoadingIndicator } from "components/loading-indicator";
import { dataToJS } from "libs";
import NoData from "./NoData";

const getMuiTheme = () =>
  createMuiTheme({
    overrides: {
      MUIDataTableToolbar: {
        root: {
          display: "none"
        }
      },
      MUIDataTableToolbarSelect: {
        root: {
          display: "none"
        }
      },
      MUIDataTableBodyCell: {
        root: {
          padding: "4px"
        }
      },
      MUIDataTableHeadCell: {
        root: {
          padding: "4px"
        }
      }
    }
  });

const IndexTable = ({
  columns,
  data,
  onTableChange,
  defaultFilters,
  loading,
  path,
  namespace
}) => {
  const { meta, filters, records } = data;
  const per = meta.get("per");
  const total = meta.get("total");

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

  const options = {
    responsive: "stacked",
    count: total,
    rowsPerPage: per,
    filterType: "checkbox",
    fixedHeader: false,
    elevation: 0,
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
  };

  const tableOptions = {
    columns,
    options,
    data: dataToJS(records)
  };

  const DataTable = () =>
    tableOptions.data.length ? <MUIDataTable {...tableOptions} /> : <NoData />;

  return (
    <MuiThemeProvider theme={getMuiTheme}>
      {loading ? <LoadingIndicator loading={loading} /> : <DataTable />}
    </MuiThemeProvider>
  );
};

IndexTable.propTypes = {
  onTableChange: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
  defaultFilters: PropTypes.object,
  loading: PropTypes.bool,
  path: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired
};

export default IndexTable;
