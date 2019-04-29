import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import React from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

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

const indexTable = ({
  columns,
  data,
  onTableChange,
  defaultFilters,
  title
}) => {
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
    customToolbarSelect: () => null,
    onTableChange: handleTableChange,
    rowsPerPageOptions: [20, 50, 75, 100]
  };

  const tableOptions = {
    columns,
    options,
    data: data.results
  };

  return (
    <MuiThemeProvider theme={getMuiTheme}>
      <Box mb={3}>
        <Typography variant="h6" component="h6">
          {title}
        </Typography>
      </Box>
      <MUIDataTable {...tableOptions} />
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
