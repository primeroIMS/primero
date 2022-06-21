import PropTypes from "prop-types";
import { TableCell, TableRow } from "@material-ui/core";
import isNil from "lodash/isNil";

import InsightsTableHeaderSubItems from "../insights-table-header-sub-items";
import { buildGroupedSubItemColumns } from "../../utils";

import css from "./styles.css";
import { NAME } from "./constants";

const InsightsTableHeader = ({ addEmptyCell = true, columns }) => {
  const groupedSubcolumns = columns.reduce((acc, column) => ({ ...acc, [column.label]: column.items }), {});
  const groupedSubItemcolumns = buildGroupedSubItemColumns(columns);
  const subcolumnsNumber = Object.values(groupedSubcolumns)
    .flat()
    .some(subcolumn => !isNil(subcolumn));

  return (
    <>
      <TableRow className={css.tableRowHeader}>
        {addEmptyCell && <TableCell />}
        {columns.map(column => (
          <TableCell key={column.label} colSpan={column.colspan || column.items?.length}>
            {column.label}
          </TableCell>
        ))}
      </TableRow>
      {subcolumnsNumber && (
        <TableRow className={css.tableRowSubHeader}>
          {addEmptyCell && <TableCell />}
          {Object.entries(groupedSubcolumns).flatMap(([parent, subcolumns]) =>
            subcolumns.map(subcolumn => (
              <TableCell
                key={`${parent}-${subcolumn}`}
                colSpan={groupedSubItemcolumns[`${parent}-${subcolumn}`]?.length}
              >
                {subcolumn}
              </TableCell>
            ))
          )}
        </TableRow>
      )}
      <InsightsTableHeaderSubItems groupedSubItemcolumns={groupedSubItemcolumns} />
    </>
  );
};

InsightsTableHeader.displayName = NAME;

InsightsTableHeader.propTypes = {
  addEmptyCell: PropTypes.bool,
  columns: PropTypes.array
};

export default InsightsTableHeader;
