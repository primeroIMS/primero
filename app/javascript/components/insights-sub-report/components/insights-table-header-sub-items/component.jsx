import PropTypes from "prop-types";
import { TableCell, TableRow } from "@material-ui/core";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../i18n";

import css from "./styles.css";
import { NAME } from "./constants";

const InsightsTableHeaderSubItems = ({ addEmptyCell = true, groupedSubItemcolumns }) => {
  const i18n = useI18n();

  if (isEmpty(groupedSubItemcolumns)) {
    return null;
  }

  return (
    <TableRow className={css.tableRowSubHeader}>
      {addEmptyCell && <TableCell />}
      {Object.entries(groupedSubItemcolumns).flatMap(([parent, subItemsColumns]) =>
        subItemsColumns.map(subItem => (
          <TableCell key={`${parent}-${subItem}`}>
            {i18n.t(`managed_reports.violations.sub_reports.${subItem}`)}
          </TableCell>
        ))
      )}
    </TableRow>
  );
};

InsightsTableHeaderSubItems.displayName = NAME;

InsightsTableHeaderSubItems.propTypes = {
  addEmptyCell: PropTypes.bool,
  groupedSubItemcolumns: PropTypes.object
};

export default InsightsTableHeaderSubItems;
