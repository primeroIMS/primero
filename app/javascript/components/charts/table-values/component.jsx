// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Paper, Table, TableBody, TableHead } from "@mui/material";
import isEmpty from "lodash/isEmpty";

import EmptyState from "../../loading-indicator/components/empty-state";

import { ChartTableRow, TableHeader } from "./components";
import generateKey from "./utils";
import css from "./styles.css";

function TableValues({
  columns,
  values,
  showPlaceholder = false,
  name = "",
  emptyMessage = "",
  subColumnItemsSize,
  valueRender = null,
  withTotals = false
}) {
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
            {values.map(value => (
              <ChartTableRow
                key={generateKey(JSON.stringify(value.row))}
                value={value}
                subColumnItemsSize={subColumnItemsSize}
                valueRender={valueRender}
                withTotals={withTotals}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

TableValues.displayName = "TableValues";

TableValues.propTypes = {
  columns: PropTypes.array,
  emptyMessage: PropTypes.string,
  headerTitle: PropTypes.string,
  name: PropTypes.string,
  showPlaceholder: PropTypes.bool,
  subColumnItemsSize: PropTypes.number,
  valueRender: PropTypes.func,
  values: PropTypes.array,
  withTotals: PropTypes.bool
};

export default TableValues;
