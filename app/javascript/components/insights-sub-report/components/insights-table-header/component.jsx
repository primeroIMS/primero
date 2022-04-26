import PropTypes from "prop-types";
import { TableCell, TableRow } from "@material-ui/core";
import isNil from "lodash/isNil";

import css from "./styles.css";
import { NAME } from "./constants";

const InsightsTableHeader = ({ addEmptyCell = true, columns }) => {
  const groupedSubcolumns = columns.reduce((acc, column) => ({ ...acc, [column.label]: column.items }), {});
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
            subcolumns.map(subcolumn => <TableCell key={`${parent}-${subcolumn}`}>{subcolumn}</TableCell>)
          )}
        </TableRow>
      )}
    </>
  );
};

InsightsTableHeader.displayName = NAME;

InsightsTableHeader.propTypes = {
  addEmptyCell: PropTypes.bool,
  columns: PropTypes.array
};

export default InsightsTableHeader;
