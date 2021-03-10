import PropTypes from "prop-types";
import { TableCell, TableRow } from "@material-ui/core";
import isEmpty from "lodash/isEmpty";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

import { useI18n } from "../../../i18n";
import styles from "../styles.css";
import generateKey from "../utils";

import { emptyColumn } from "./utils";

const useStyles = makeStyles(styles);

const TableHeader = ({ columns }) => {
  const i18n = useI18n();
  const css = useStyles();
  let newColumns = columns;

  if (isEmpty(newColumns)) {
    newColumns = emptyColumn(i18n, true);
  }

  const arrayOfObjects = newColumns.every(column => typeof column === "object");

  if (!arrayOfObjects) {
    const singleColumns =
      newColumns.length === 1 && isEmpty(newColumns[0])
        ? emptyColumn(i18n)
        : emptyColumn(i18n, true).concat(newColumns);

    return (
      <TableRow key={generateKey("column-row")}>
        {singleColumns.map(column => (
          <TableCell key={generateKey("cell")}>{column}</TableCell>
        ))}
      </TableRow>
    );
  }

  return (
    <>
      {newColumns.map((column, index) => {
        const { items, colspan } = column;
        const isFirstHeading = index === 0;
        const emptyCells = emptyColumn(i18n, true);
        const repeat = isFirstHeading ? 0 : newColumns[0].items.filter(i => i !== "Total").length;
        const cells = isFirstHeading ? items : Array.from({ length: repeat }, () => items).flat();
        const allCells = isFirstHeading ? emptyCells.concat(cells) : emptyCells.concat(cells).concat("");

        return (
          <TableRow className={clsx({ [css.tableRowHeader]: index === 0 })} key={generateKey("column-row")}>
            {allCells.map(cell => {
              if (isEmpty(cell)) {
                return <TableCell className={css.borderHeadingRight} key={generateKey()} />;
              }
              if (cell === "Total") {
                return (
                  <TableCell className={css.borderHeadingRight} key={generateKey()}>
                    {cell}
                  </TableCell>
                );
              }

              return (
                <TableCell key={generateKey()} colSpan={colspan}>
                  {cell}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </>
  );
};

TableHeader.displayName = "TableHeader";

TableHeader.propTypes = {
  columns: PropTypes.array
};

export default TableHeader;
