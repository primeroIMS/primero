// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Paper, Table, TableBody, TableHead, TableCell, TableRow } from "@mui/material";
import isEmpty from "lodash/isEmpty";

import EmptyState from "../../../loading-indicator/components/empty-state";
import css from "../../../charts/table-values/components/table-row/styles.css";
import InsightsTableHeader from "../insights-table-header";
import { ChartTableRow } from "../../../charts/table-values/components";

function TableValues({
  columns,
  headerTitle,
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
            <InsightsTableHeader
              columns={columns}
              subColumnItemsSize={subColumnItemsSize}
              headerTitle={headerTitle}
              withTotals={withTotals}
            />
          </TableHead>
          <TableBody>
            {values.map(value => {
              if (value.separator) {
                return (
                  <TableRow className={css.tableRow} key={value.row[0]}>
                    <TableCell colSpan={value.row?.length || 1} className={css.tableCell}>
                      {value.row[0]}
                    </TableCell>
                  </TableRow>
                );
              }

              return (
                <ChartTableRow
                  key={JSON.stringify(value.row)}
                  value={value}
                  subColumnItemsSize={subColumnItemsSize}
                  valueRender={valueRender}
                  withTotals={withTotals}
                />
              );
            })}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

TableValues.displayName = "InsightTableValues";

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
