// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { TableCell, TableRow } from "@mui/material";
import isEmpty from "lodash/isEmpty";
import isObjectLike from "lodash/isObjectLike";
import clsx from "clsx";

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
        subItemsColumns.map((subItem, index) => {
          const cellClass = clsx({
            [css.tableCell]: (index + 1) % subItemsColumns?.length === 0,
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
};

InsightsTableHeaderSubItems.displayName = NAME;

InsightsTableHeaderSubItems.propTypes = {
  addEmptyCell: PropTypes.bool,
  groupedSubItemcolumns: PropTypes.object
};

export default InsightsTableHeaderSubItems;
