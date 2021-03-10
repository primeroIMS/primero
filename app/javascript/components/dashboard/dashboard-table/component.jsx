import { useDispatch, useSelector } from "react-redux";
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import { push } from "connected-react-router";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { isEqual } from "lodash";

import { dataToJS, useThemeHelper } from "../../../libs";
import { buildFilter } from "../utils";
import { getPermissions } from "../../user/selectors";
import tableCellGreaterThanZero from "../../pages/dashboard/utils/table-cell-greater-than-zero";

import dashboardTableTheme from "./theme";

const DashboardTable = ({ columns, data, query, title, pathname }) => {
  const userPermissions = useSelector(state => getPermissions(state), isEqual);
  const clickableCell = [...userPermissions.keys()].includes(pathname.split("/")[1]);
  const { theme } = useThemeHelper({ theme: dashboardTableTheme(clickableCell) });

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

        if (clickableCell && Array.isArray(clickedCellQuery) && colData > 0) {
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

  console.log("COLUMNS", columns);
  const columnsWithNotClickableZeroColumns =
    columns?.length > 0 &&
    columns.map(col => {
      // if (typeof col.options !== "undefined") {
      //   return {
      //     ...col,
      //     options: {
      //       ...col.options,
      //       ...tableCellGreaterThanZero(clickableCell)
      //     }
      //   };
      // }

      return { ...col, options: tableCellGreaterThanZero(clickableCell) };
    });

  console.log(columnsWithNotClickableZeroColumns);

  const tableOptions = {
    columns: columnsWithNotClickableZeroColumns,
    options,
    data: dataToJS(data),
    title
  };

  return <MUIDataTable {...tableOptions} />;
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
