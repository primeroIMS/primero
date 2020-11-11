import React from "react";
import PropTypes from "prop-types";
import { TableCell, TableRow } from "@material-ui/core";
import isEmpty from "lodash/isEmpty";

const TableHeader = ({ columns }) => {
  let newColumns = columns;

  if (isEmpty(newColumns)) {
    newColumns = ["", "Total"];
  }

  const arrayOfObjects = newColumns.every(column => typeof column === "object");

  if (!arrayOfObjects) {
    return (
      <TableRow key={`${Math.floor(Math.random() * 10000 + 1)}-column-row`}>
        {newColumns.map(column => {
          return <TableCell key={`${Math.floor(Math.random() * 10000 + 1)}-cell`}>{column}</TableCell>;
        })}
      </TableRow>
    );
  }

  return (
    <>
      {newColumns.map((column, index) => {
        const { items, colspan } = column;
        const isFirstHeading = index === 0;
        const emptyCells = Array.from({ length: 1 }, () => "");
        const repeat = isFirstHeading ? 0 : newColumns[0].items.filter(i => i !== "Total").length;
        const cells = isFirstHeading ? items : Array.from({ length: repeat }, () => items).flat();
        const allCells = isFirstHeading ? emptyCells.concat(cells) : emptyCells.concat(cells).concat("");

        return (
          <TableRow key={`${Math.floor(Math.random() * 10000 + 1)}-column-row`}>
            {allCells.map(cell => {
              if (isEmpty(cell)) {
                return <TableCell key={`${Math.floor(Math.random() * 10000 + 1)}`} />;
              }
              if (cell === "Total") {
                return <TableCell key={`${Math.floor(Math.random() * 10000 + 1)}`}>{cell}</TableCell>;
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
