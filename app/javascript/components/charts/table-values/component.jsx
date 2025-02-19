// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Paper, Table, TableBody, TableHead } from "@mui/material";
import isEmpty from "lodash/isEmpty";

import EmptyState from "../../loading-indicator/components/empty-state";
import InsightsTableHeader from "../../insights-sub-report/components/insights-table-header";

import { TableHeader, TableRows } from "./components";
import css from "./styles.css";

function TableValues({
  columns,
  values,
  showPlaceholder = false,
  name = "",
  emptyMessage = "",
  useInsightsHeader = false,
  subColumnItemsSize,
  valueRender = null
}) {
  const Header = useInsightsHeader ? InsightsTableHeader : TableHeader;

  return (
    <Paper className={css.root}>
      {showPlaceholder && isEmpty(values) ? (
        <EmptyState type={name} emptyMessage={emptyMessage} />
      ) : (
        <Table className={css.table}>
          <TableHead className={css.tableHeader}>
            <Header columns={columns} subColumnItemsSize={subColumnItemsSize} />
          </TableHead>
          <TableBody>
            <TableRows valueRender={valueRender} values={values} subColumnItemsSize={subColumnItemsSize} />
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
  name: PropTypes.string,
  showPlaceholder: PropTypes.bool,
  subColumnItemsSize: PropTypes.number,
  useInsightsHeader: PropTypes.bool,
  valueRender: PropTypes.func,
  values: PropTypes.array
};

export default TableValues;
