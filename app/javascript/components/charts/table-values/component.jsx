import React from "react";
import PropTypes from "prop-types";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

import TableHeader from "./components/table-header";
import styles from "./styles.css";

const TableValues = ({ columns, values }) => {
  const css = makeStyles(styles)();

  // eslint-disable-next-line react/no-multi-comp, react/display-name
  const singleRowRender = rowValues => (
    <TableRow key={`${rowValues[0]}-${Math.floor(Math.random() * 100 + 1)}-data`}>
      {rowValues.map(row => (
        <TableCell key={`${row}-${Math.floor(Math.random() * 100 + 1)}-value`}>{row}</TableCell>
      ))}
    </TableRow>
  );

  const rowRender = rowValues => {
    if (Array.isArray(rowValues[0])) {
      return rowValues.map(row => rowRender(row));
    }

    return singleRowRender(rowValues);
  };

  // console.log("COLUMNS", columns);
  // console.log("ROWS", values);

  return (
    <Paper className={css.root}>
      <Table className={css.table}>
        <TableHead className={css.tableHeader}>
          <TableHeader columns={columns} />
        </TableHead>
        {/* <TableBody>{rowRender(values)}</TableBody> */}
        <TableBody>
          {/* <TableRow>
            <TableCell colSpan={9}>High</TableCell>
            <TableCell>11</TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={9}>Child Maintenance</TableCell>
            <TableCell>11</TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={9}>Open</TableCell>
            <TableCell>11</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>01-Jan-2008</TableCell>
            <TableCell>1</TableCell>
            <TableCell>0</TableCell>
            <TableCell>10</TableCell>
            <TableCell>11</TableCell>
            <TableCell>0</TableCell>
            <TableCell>0</TableCell>
            <TableCell>0</TableCell>
            <TableCell>0</TableCell>
            <TableCell>11</TableCell>
          </TableRow> */}
        </TableBody>
      </Table>
    </Paper>
  );
};

TableValues.displayName = "TableValues";

TableValues.propTypes = {
  columns: PropTypes.array,
  values: PropTypes.array
};

export default TableValues;
