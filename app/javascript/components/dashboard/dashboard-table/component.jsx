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
      },
      MUIDataTableBodyRow: {
        root: {
          "&:last-child td": {
            border: "none"
          }
        }
      },
      MuiTableCell: {
        head: {
          fontSize: "12px",
          color: "#4a4a4a",
          fontWeight: "bold",
          lineHeight: "1",
          textTransform: "uppercase"
        },
        body: {
          color: "#4a4a4a",
          fontSize: "14px",
          lineHeight: "1"
        }
      }
    }
  });

const DashboardTable = ({ columns, data }) => {
  const options = {
    responsive: "stacked",
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
    onTableChange: () => null,
    pagination: false,
    selectableRows: "none"
  };

  const tableOptions = {
    columns,
    options,
    data: data.toJS().results
  };

  return (
    <MuiThemeProvider theme={getMuiTheme}>
      <MUIDataTable {...tableOptions} />
    </MuiThemeProvider>
  );
};

DashboardTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired
};

export default DashboardTable;
