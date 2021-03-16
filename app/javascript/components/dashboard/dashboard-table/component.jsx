import { push } from "connected-react-router";
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";

import { dataToJS, useMemoizedSelector } from "../../../libs";
import { buildFilter } from "../utils";
import { getPermissions } from "../../user/selectors";
import tableCellGreaterThanZero from "../../pages/dashboard/utils/table-cell-greater-than-zero";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const DashboardTable = ({ columns, data, query, title, pathname }) => {
  const css = useStyles();
  const userPermissions = useMemoizedSelector(state => getPermissions(state));
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

  const columnsWithNotClickableZeroCells =
    columns?.length > 0 &&
    columns.map(col => {
      if (typeof col.options !== "undefined") {
        return {
          ...col,
          options: {
            ...col.options,
            ...tableCellGreaterThanZero(clickableCell)
          }
        };
      }

      return { ...col, options: tableCellGreaterThanZero(clickableCell) };
    });

  const tableOptions = {
    columns: columnsWithNotClickableZeroCells || columns,
    options,
    data: dataToJS(data),
    title
  };

  return (
    <div className={css.tableContainer}>
      <MUIDataTable {...tableOptions} />
    </div>
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
