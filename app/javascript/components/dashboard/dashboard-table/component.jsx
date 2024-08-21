// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { push } from "connected-react-router";
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { dataToJS, useMemoizedSelector } from "../../../libs";
import { buildFilter } from "../utils";
import { getPermissions } from "../../user/selectors";
import tableCellGreaterThanZero from "../../pages/dashboard/utils/table-cell-greater-than-zero";
import getCellValue from "../../pages/dashboard/utils/get-cell-value";
import { defaultTableOptions } from "../../index-table/utils";

import css from "./styles.css";

function DashboardTable({ columns, data, query, title, pathname }) {
  const userPermissions = useMemoizedSelector(state => getPermissions(state));
  const clickableCell = [...userPermissions.keys()].includes(pathname.split("/")[1]);

  const dispatch = useDispatch();
  const options = {
    ...defaultTableOptions({ simple: true, title }),
    tableBodyMaxHeight: "260px",
    fixedHeader: true,
    onCellClick: (colData, cellMeta) => {
      const { colIndex, rowIndex } = cellMeta;
      const columnName = columns[colIndex].name;

      if (typeof query[rowIndex] !== "undefined") {
        const clickedCellQuery = query[rowIndex][columnName];

        const colValue = getCellValue(colData);

        if (clickableCell && Array.isArray(clickedCellQuery) && colValue > 0) {
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
    <div className={css.tableContainer} data-testid="dashboard-table">
      <MUIDataTable {...tableOptions} />
    </div>
  );
}

DashboardTable.displayName = "DashboardTable";

DashboardTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  pathname: PropTypes.string.isRequired,
  query: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  title: PropTypes.string
};

export default DashboardTable;
