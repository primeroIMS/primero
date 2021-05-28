import PropTypes from "prop-types";
import { Paper, Table, TableBody, TableHead } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { TableHeader, TableRows } from "./components";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const TableValues = ({ columns, values }) => {
  const css = useStyles();

  return (
    <Paper className={css.root}>
      <Table className={css.table}>
        <TableHead className={css.tableHeader}>
          <TableHeader columns={columns} />
        </TableHead>
        <TableBody>
          <TableRows values={values} />
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
