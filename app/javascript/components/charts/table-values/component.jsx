import PropTypes from "prop-types";
import { Paper, Table, TableBody, TableHead } from "@material-ui/core";

import { TableHeader, TableRows } from "./components";
import css from "./styles.css";

const TableValues = ({ columns, values }) => {
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
