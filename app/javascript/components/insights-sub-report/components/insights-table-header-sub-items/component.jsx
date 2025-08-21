// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { TableCell, TableRow } from "@mui/material";
import isObjectLike from "lodash/isObjectLike";
import { cx } from "@emotion/css";

import { useI18n } from "../../../i18n";

import css from "./styles.css";
import { NAME } from "./constants";

function InsightsTableHeaderSubItems({ addEmptyCell = true, groupedSubItemColumns, withTotals = false }) {
  const i18n = useI18n();

  return (
    <TableRow className={css.tableRowSubHeader}>
      {addEmptyCell && <TableCell />}
      {Object.entries(groupedSubItemColumns).flatMap(([parent, subItemsColumns]) =>
        subItemsColumns.map((subItem, index) => {
          const cellClass = cx({
            [css.tableCell]: withTotals && (index + 1) % subItemsColumns?.length === 0,
            [css.tableCellCenterClass]: true
          });

          const subItemTitle = isObjectLike(subItem)
            ? subItem.display_text
            : i18n.t(`managed_reports.violations.sub_reports.${subItem}`);

          return (
            <TableCell key={`${parent}-${subItem}-${subItemTitle}`} className={cellClass}>
              {subItemTitle}
            </TableCell>
          );
        })
      )}
    </TableRow>
  );
}

InsightsTableHeaderSubItems.displayName = NAME;

InsightsTableHeaderSubItems.propTypes = {
  addEmptyCell: PropTypes.bool,
  groupedSubItemColumns: PropTypes.object,
  withTotals: PropTypes.bool
};

export default InsightsTableHeaderSubItems;
