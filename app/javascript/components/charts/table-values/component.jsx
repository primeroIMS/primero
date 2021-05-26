import PropTypes from "prop-types";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";

import TableHeader from "./components/table-header";
import styles from "./styles.css";
import generateKey from "./utils";

const useStyles = makeStyles(styles);

const TableValues = ({ columns, values }) => {
  const css = useStyles();

  const renderRows = allValues => {
    return allValues.map(value => {
      const { colspan, row } = value;
      const classes = clsx({ [css.tableRow]: colspan !== 0, [css.tableRowValues]: true });

      return (
        <TableRow className={classes} key={`${Math.floor(Math.random() * 10000 + 1)}-data`}>
          {row.map(r => {
            return (
              <TableCell colSpan={colspan} key={generateKey(value)}>
                <span>{r}</span>
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
