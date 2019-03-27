import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import React from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

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
      }
    }
  });

const indexTable = ({ columns, data, onTableChange, defaultFilters }) => {
  const { per, total } = data.meta;

  const handleTableChange = (action, tableState) => {
    const options = { per, ...defaultFilters, ...data.filters };

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

    if (action !== "rowsSelect") {
      onTableChange(selectedFilters);
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
    customToolbarSelect: () => <></>,
    onTableChange: handleTableChange,
    rowsPerPageOptions: [20, 50, 75, 100]
  };

  return (
    <MuiThemeProvider theme={getMuiTheme}>
      <MUIDataTable data={data.results} options={options} columns={columns} />
    </MuiThemeProvider>
  );
};

indexTable.propTypes = {
  onTableChange: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  defaultFilters: PropTypes.object // eslint-disable-line react/forbid-prop-types, react/require-default-props
};

export default indexTable;
