import React from "react";
import { isArray } from "lodash";
import PropTypes from "prop-types";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import makeStyles from "@material-ui/styles/makeStyles";

import styles from "./styles.css";

const TableValues = ({ columns, values }) => {
  const css = makeStyles(styles)();

  const singleRowRender = rowValues => (
    <TableRow
      key={`${rowValues[0]}-${Math.floor(Math.random() * 100 + 1)}-data`}
    >
      {rowValues.map(row => (
        <TableCell key={`${row}-${Math.floor(Math.random() * 100 + 1)}-value`}>
          {row}
        </TableCell>
      ))}
    </TableRow>
  );

  const rowRender = rowValues => {
    if (isArray(rowValues[0])) {
      return rowValues.map(row => rowRender(row));
    }

    return singleRowRender(rowValues);
  };

  return (
    <Paper className={css.root}>
      <Table className={css.table}>
        <TableHead>
          <TableRow>
            {columns.map(column => {
              return <TableCell key={`${column}-column`}>{column}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>{rowRender(values)}</TableBody>
      </Table>
    </Paper>
  );
};

TableValues.propTypes = {
  columns: PropTypes.array,
  values: PropTypes.array
};

export default TableValues;
