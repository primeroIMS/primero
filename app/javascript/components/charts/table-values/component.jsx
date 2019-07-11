import React from "react";
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
  return (
    <Paper className={css.Root}>
      <Table className={css.Table}>
        <TableHead>
          <TableRow>
            {columns.map(column => {
              return <TableCell key={column}>{column}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {values.map(value => (
            <TableRow key={value[0]}>
              {value.map(row => (
                <TableCell key={row}>{row}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

TableValues.propTypes = {
  columns: PropTypes.object,
  values: PropTypes.object
};

export default TableValues;
