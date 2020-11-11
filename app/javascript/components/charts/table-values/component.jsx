import React from "react";
import PropTypes from "prop-types";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

import TableHeader from "./components/table-header";
import styles from "./styles.css";

const TableValues = ({ columns, values }) => {
  const css = makeStyles(styles)();

  const renderRows = allValues => {
    return allValues.map(v => {
      const { colspan, row } = v;

      return (
        <TableRow key={`${Math.floor(Math.random() * 10000 + 1)}-data`}>
          {row.map(r => {
            return (
              <TableCell colSpan={colspan} key={`${Math.floor(Math.random() * 10000 + 1)}-value`}>
                {r}
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  };

  return (
    <Paper className={css.root}>
      <Table className={css.table}>
        <TableHead className={css.tableHeader}>
          <TableHeader columns={columns} />
        </TableHead>
        <TableBody>{renderRows(values)}</TableBody>
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
