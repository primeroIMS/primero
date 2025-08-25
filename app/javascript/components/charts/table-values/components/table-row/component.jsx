// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { cx } from "@emotion/css";
import { TableCell, TableRow } from "@mui/material";

import { useI18n } from "../../../../i18n";
import generateKey from "../../utils";

import css from "./styles.css";

function Component({ subColumnItemsSize, value, valueRender, withTotals }) {
  const i18n = useI18n();
  const totalText = i18n.t("managed_reports.total");
  const { colspan, row } = value;
  const classes = cx({ [css.tableRow]: colspan !== 0, [css.tableRowValues]: true });

  return (
    <TableRow className={classes}>
      {row.map((rowData, index) => {
        const cellClass =
          subColumnItemsSize &&
          cx({
            [css.tableCell]: withTotals && ((index % subColumnItemsSize === 0 && index !== 0) || row[0] === totalText),
            [css.tableCellSize]: Boolean(subColumnItemsSize) && index > 0
          });

        const displayValue = valueRender ? valueRender(rowData, index) : rowData;

        return (
          <TableCell colSpan={index === 0 ? colspan : 1} key={generateKey(rowData)} className={cellClass}>
            <span>{displayValue}</span>
          </TableCell>
        );
      })}
    </TableRow>
  );
}

Component.displayName = "ChartTableRow";

Component.propTypes = {
  subColumnItemsSize: PropTypes.number,
  value: PropTypes.object,
  valueRender: PropTypes.func,
  withTotals: PropTypes.bool
};

export default Component;
