import PropTypes from "prop-types";
import { TableCell, TableRow } from "@material-ui/core";

import css from "../table-header/styles.css";

import { NAME } from "./constants";

const InsightsTableHeader = ({ addEmptyCell, columns }) => {
  const subcolumns = columns.reduce((acc, column) => ({ ...acc, [column.label]: column.items }), {});

  return (
    <>
      <TableRow className={css.tableRowHeader}>
        {addEmptyCell && <TableCell />}
        {columns.map(column => (
          <TableCell key={`${column.label}-${column.items.join("-")}`} colSpan={column.colspan || column.items.length}>
            {column.label}
          </TableCell>
        ))}
      </TableRow>
      <TableRow className={css.tableRowSubHeader}>
        {addEmptyCell && <TableCell />}
        {Object.entries(subcolumns).flatMap(([parent, values]) =>
          values.map(subcolumn => <TableCell key={`${parent}-${subcolumn}`}>{subcolumn}</TableCell>)
        )}
      </TableRow>
    </>
  );
};

InsightsTableHeader.displayName = NAME;

InsightsTableHeader.defaultProps = {
  addEmptyCell: true
};

InsightsTableHeader.propTypes = {
  addEmptyCell: PropTypes.bool,
  columns: PropTypes.array
};

export default InsightsTableHeader;
