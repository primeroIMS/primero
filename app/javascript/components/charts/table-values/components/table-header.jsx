import React from "react";
import PropTypes from "prop-types";
import { TableCell, TableRow } from "@material-ui/core";
import isEmpty from "lodash/isEmpty";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

import { useI18n } from "../../../i18n";
import styles from "../styles.css";

import { emptyColum } from "./utils";

const TableHeader = ({ columns }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  let newColumns = columns;

  if (isEmpty(newColumns)) {
    newColumns = emptyColum(i18n, true);
  }

  const arrayOfObjects = newColumns.every(column => typeof column === "object");

  if (!arrayOfObjects) {
    const singleColumns =
      newColumns.length === 1 && isEmpty(newColumns[0]) ? emptyColum(i18n) : emptyColum(i18n, true).concat(newColumns);

    return (
      <TableRow key={`${Math.floor(Math.random() * 10000 + 1)}-column-row`}>
        {singleColumns.map(column => (
          <TableCell key={`${Math.floor(Math.random() * 10000 + 1)}-cell`}>{column}</TableCell>
        ))}
      </TableRow>
    );
  }

  return (
    <>
      {newColumns.map((column, index) => {
        const { items, colspan } = column;
        const isFirstHeading = index === 0;
        const emptyCells = emptyColum(i18n, true);
        const repeat = isFirstHeading ? 0 : newColumns[0].items.filter(i => i !== "Total").length;
        const cells = isFirstHeading ? items : Array.from({ length: repeat }, () => items).flat();
        const allCells = isFirstHeading ? emptyCells.concat(cells) : emptyCells.concat(cells).concat("");

        return (
          <TableRow
            className={clsx({ [css.tableRowHeader]: index === 0 })}
            key={`${Math.floor(Math.random() * 10000 + 1)}-column-row`}
          >
            {allCells.map(cell => {
              if (isEmpty(cell)) {
                return (
                  <TableCell className={css.borderHeadingRight} key={`${Math.floor(Math.random() * 10000 + 1)}`} />
                );
              }
              if (cell === "Total") {
                return (
                  <TableCell className={css.borderHeadingRight} key={`${Math.floor(Math.random() * 10000 + 1)}`}>
                    {cell}
                  </TableCell>
                );
              }

              return (
                <TableCell key={`${Math.floor(Math.random() * 10000 + 1)}`} colSpan={colspan}>
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
