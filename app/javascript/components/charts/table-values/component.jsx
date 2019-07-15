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
              return <TableCell key={`${column}-column`}>{column}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {values.map(value => (
            <TableRow key={`${value[0]}-row-data`}>
              {value.map((row, index) => (
                <TableCell key={`${row}-${index}-value`}>{row}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

TableValues.propTypes = {
  columns: PropTypes.array,
  values: PropTypes.array
};

export default TableValues;
