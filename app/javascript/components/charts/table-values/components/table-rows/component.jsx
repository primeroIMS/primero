// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import clsx from "clsx";
import { TableCell, TableRow } from "@material-ui/core";

import { useI18n } from "../../../../i18n";
import generateKey from "../../utils";

import css from "./styles.css";
import { NAME } from "./constants";

const Component = ({ values, subColumnItemsSize }) => {
  const i18n = useI18n();
  const totalText = i18n.t("managed_reports.total");

  return values.map(value => {
    const { colspan, row } = value;
    const classes = clsx({ [css.tableRow]: colspan !== 0, [css.tableRowValues]: true });

    return (
      <TableRow className={classes} key={generateKey(JSON.stringify(value.row))}>
        {row.map((rowData, index) => {
          const cellClass =
            subColumnItemsSize &&
            clsx({
              [css.tableCell]: (index % subColumnItemsSize === 0 && index !== 0) || row[0] === totalText,
              [css.tableCellSize]: Boolean(subColumnItemsSize) && index > 0
            });

          return (
            <TableCell colSpan={index === 0 ? colspan : 1} key={generateKey(rowData)} className={cellClass}>
              <span>{rowData}</span>
            </TableCell>
          );
        })}
      </TableRow>
    );
  });
};

Component.displayName = NAME;

Component.defaultProps = {
  values: []
};

Component.propTypes = {
  subColumnItemsSize: PropTypes.number,
  values: PropTypes.array
};

export default Component;
