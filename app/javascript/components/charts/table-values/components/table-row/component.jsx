// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { cx } from "@emotion/css";
import { TableCell, TableRow } from "@mui/material";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import { ROUTES } from "../../../../../config";
import ActionButton from "../../../../action-button";
import { useI18n } from "../../../../i18n";
import generateKey from "../../utils";
import { buildFilter } from "../../../../dashboard/utils";

import css from "./styles.css";

const defaultValueRender = rowValue => {
  if (Object.hasOwn(rowValue, "count")) {
    return rowValue.count;
  }

  return rowValue;
};

function Component({ subColumnItemsSize, value, valueRender, withTotals }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
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

        const displayValue = valueRender ? valueRender(rowData, index) : defaultValueRender(rowData);

        const handleClick = () => {
          dispatch(push({ pathname: ROUTES.incidents, search: buildFilter(rowData.query) }));
        };

        const linkClasses = cx({ [css.link]: true, [css.zero]: displayValue === 0 });

        return (
          <TableCell colSpan={index === 0 ? colspan : 1} key={generateKey(rowData)} className={cellClass}>
            {rowData.query ? (
              <ActionButton className={linkClasses} type="link" text={displayValue} onClick={handleClick} noTranslate />
            ) : (
              <span>{displayValue}</span>
            )}
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
