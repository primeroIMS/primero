import { useDispatch, useSelector } from "react-redux";
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import React from "react";
import { push } from "connected-react-router";
import { MuiThemeProvider } from "@material-ui/core/styles";

import { dataToJS } from "../../../libs";
import { buildFilter } from "../utils";
import { getPermissions } from "../../user/selectors";

import dashboardTableTheme from "./theme";

const DashboardTable = ({ columns, data, query, title, pathname }) => {
  const userPermissions = useSelector(state => getPermissions(state));
  const clickableCell = [...userPermissions.keys()].includes(pathname.split("/")[1]);

  const dispatch = useDispatch();
  const options = {
    responsive: "vertical",
    fixedHeader: false,
    elevation: 0,
    filter: false,
    download: false,
    search: false,
    print: false,
    viewColumns: false,
    serverSide: true,
    setTableProps: () => ({ "aria-label": title }),
    customToolbar: () => null,
    customToolbarSelect: () => null,
    onTableChange: () => null,
    pagination: false,
    selectableRows: "none",
    sort: false,
    onCellClick: (colData, cellMeta) => {
      const { colIndex, rowIndex } = cellMeta;
      const columnName = columns[colIndex].name;

      if (typeof query[rowIndex] !== "undefined") {
        const clickedCellQuery = query[rowIndex][columnName];

        if (clickableCell && Array.isArray(clickedCellQuery)) {
          dispatch(
            push({
              pathname,
              search: buildFilter(clickedCellQuery, true)
            })
          );
        }
      }
    }
  };

  const tableOptions = {
    columns,
    options,
    data: dataToJS(data),
    title
  };

  return (
    <MuiThemeProvider theme={dashboardTableTheme}>
      <MUIDataTable {...tableOptions} />
    </MuiThemeProvider>
  );
};

DashboardTable.displayName = "DashboardTable";

DashboardTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  pathname: PropTypes.string.isRequired,
  query: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  title: PropTypes.string
};

export default DashboardTable;
