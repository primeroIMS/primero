// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { TableCell, TableRow } from "@mui/material";
import isEmpty from "lodash/isEmpty";
import clsx from "clsx";

import { useI18n } from "../../../../i18n";
import generateKey from "../../utils";

import css from "./styles.css";
import { emptyColumn } from "./utils";
import { NAME } from "./constants";

const TableHeader = ({ columns }) => {
  const i18n = useI18n();

  let newColumns = columns;
  const totalTranslation = i18n.t("report.total");

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
        const { items, colspan, addEmptyCell } = column;
        const isFirstHeading = index === 0;
        const emptyCells = emptyColumn(i18n, true);
        const repeat = isFirstHeading ? 0 : newColumns[0].items.filter(i => i !== totalTranslation).length;
        const cells = isFirstHeading ? items : Array.from({ length: repeat }, () => items).flat();
        const allCells =
          isFirstHeading || addEmptyCell === false ? emptyCells.concat(cells) : emptyCells.concat(cells).concat("");
        const classes = clsx({ [css.tableRowHeader]: index === 0, [css.tableRowSubHeader]: index > 0 });

        return (
          <TableRow className={classes} key={generateKey("column-row")}>
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

TableHeader.displayName = NAME;

TableHeader.propTypes = {
  columns: PropTypes.array
};

export default TableHeader;
