import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import React from "react";
import {
  createMuiTheme,
  MuiThemeProvider,
  Box,
  Typography
} from "@material-ui/core";
import { LoadingIndicator } from "components/loading-indicator";
import { Map, List } from "immutable";

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

const dataToJS = data => {
  if (data instanceof Map || data instanceof List) {
    return data.toJS();
  }

  return data;
};

const IndexTable = ({
  columns,
  data,
  onTableChange,
  defaultFilters,
  title,
  loading
}) => {
  const { meta, filters, results } = data;
  const { per, total } = dataToJS(meta);

  const handleTableChange = (action, tableState) => {
    const options = { per, ...defaultFilters, ...dataToJS(filters) };
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
    data: dataToJS(results)
  };

  return (
    <MuiThemeProvider theme={getMuiTheme}>
      <Box mb={3}>
        <Typography variant="h6" component="h6">
          {title}
        </Typography>
      </Box>
      {loading ? (
        <LoadingIndicator loading={loading} />
      ) : (
        <MUIDataTable {...tableOptions} />
      )}
    </MuiThemeProvider>
  );
};

IndexTable.propTypes = {
  onTableChange: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
  defaultFilters: PropTypes.object,
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool
};

export default IndexTable;
