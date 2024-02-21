import PropTypes from "prop-types";
import { Paper, Table, TableBody, TableHead } from "@material-ui/core";
import isEmpty from "lodash/isEmpty";

import EmptyState from "../../loading-indicator/components/empty-state";
import InsightsTableHeader from "../../insights-sub-report/components/insights-table-header";

import { TableHeader, TableRows } from "./components";
import css from "./styles.css";

const TableValues = ({
  columns,
  values,
  showPlaceholder = false,
  name = "",
  emptyMessage = "",
  useInsightsHeader = false,
  subColumnItemsSize
}) => {
  const Header = useInsightsHeader ? InsightsTableHeader : TableHeader;

  return (
    <Paper className={css.root} >
      {showPlaceholder && isEmpty(values) ? (
        <EmptyState type={name} emptyMessage={emptyMessage} />
      ) : (
        <Table className={css.table} role="tableRow" >
          <TableHead className={css.tableHeader}>
            <Header columns={columns} subColumnItemsSize={subColumnItemsSize} />
          </TableHead>
          <TableBody>
            <TableRows values={values} subColumnItemsSize={subColumnItemsSize} />
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
  subColumnItemsSize: PropTypes.number,
  useInsightsHeader: PropTypes.bool,
  values: PropTypes.array
};

export default TableValues;
