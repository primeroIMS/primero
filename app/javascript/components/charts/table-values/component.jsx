import PropTypes from "prop-types";
import { Paper, Table, TableBody, TableHead } from "@material-ui/core";
import isEmpty from "lodash/isEmpty";

import EmptyState from "../../loading-indicator/components/empty-state";

import { TableHeader, TableRows } from "./components";
import css from "./styles.css";

const TableValues = ({ columns, values, showPlaceholder = false, name = "", emptyMessage = "" }) => {
  return (
    <Paper className={css.root}>
      {showPlaceholder && isEmpty(values) ? (
        <EmptyState type={name} emptyMessage={emptyMessage} />
      ) : (
        <Table className={css.table}>
          <TableHead className={css.tableHeader}>
            <TableHeader columns={columns} />
          </TableHead>
          <TableBody>
            <TableRows values={values} />
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};

TableValues.displayName = "TableValues";

TableValues.propTypes = {
  columns: PropTypes.array,
  emptyMessage: PropTypes.string,
  name: PropTypes.string,
  showPlaceholder: PropTypes.bool,
  values: PropTypes.array
};

export default TableValues;
