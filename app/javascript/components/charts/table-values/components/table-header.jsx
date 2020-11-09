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
      <TableRow>
        {newColumns.map(column => {
          return <TableCell key={`${column}-column`}>{column}</TableCell>;
        })}
      </TableRow>
    );
  }

  console.log(newColumns);

  return (
    <>
      {newColumns.map((column, index) => {
        const { items, colspan } = column;
        const isFirstHeading = index === 0;
        const emptyCells = Array.from({ length: 1 }, () => "");
        const repeat = isFirstHeading ? 0 : newColumns[0].items.filter(i => i !== "Total").length;
        const cells = isFirstHeading ? items : Array.from({ length: repeat }, () => items).flat();
        const allCells = isFirstHeading ? emptyCells.concat(cells) : emptyCells.concat(cells).concat("");

        console.log(repeat, column, allCells);

        return (
          <>
            <TableRow>
              {allCells.map(cell => {
                if (isEmpty(cell)) {
                  return <TableCell />;
                }
                if (cell === "Total") {
                  return <TableCell>{cell}</TableCell>;
                }

                return <TableCell colSpan={colspan}>{cell}</TableCell>;
              })}
            </TableRow>
          </>
        );
      })}
    </>
  );

  // return (
  //   <>
  //     <TableRow>
  //       <TableCell />
  //       <TableCell colSpan={4}>Female</TableCell>
  //       <TableCell colSpan={4}>Male</TableCell>
  //       <TableCell>TOTAL</TableCell>
  //     </TableRow>
  //     <TableRow>
  //       <TableCell />
  //       <TableCell>0 - 5</TableCell>
  //       <TableCell>6 - 11</TableCell>
  //       <TableCell>12 - 17</TableCell>
  //       <TableCell>Total</TableCell>
  //       <TableCell>0 - 5</TableCell>
  //       <TableCell>6 - 11</TableCell>
  //       <TableCell>12 - 17</TableCell>
  //       <TableCell>Total</TableCell>
  //       <TableCell />
  //     </TableRow>
  //   </>
  // );
};

TableHeader.displayName = "TableHeader";

TableHeader.propTypes = {
  columns: PropTypes.array
};

export default TableHeader;
