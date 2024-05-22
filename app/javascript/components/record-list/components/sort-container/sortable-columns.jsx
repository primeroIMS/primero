// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Fragment } from "react";
import PropTypes from "prop-types";
import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

import { useI18n } from "../../../i18n";

import css from "./styles.css";

function SortableColumns({ filters, recordType, sortableColumns }) {
  const i18n = useI18n();

  return (
    <RadioGroup defaultValue={`${filters.get("order_by")}_${filters.get("order")}`} aria-label="gender" name="order_by">
      {sortableColumns.map(column => (
        <Fragment key={column.name}>
          <div className={css.sortableColumn}>
            <div className={css.sortField}>
              <FormControlLabel
                value={`${column.name}_asc`}
                control={<Radio />}
                label={column.label?.trim() || i18n.t(`${recordType}.${column.name}`)}
              />
            </div>
            <div className={css.sortDir}>
              <ArrowUpwardIcon />
            </div>
          </div>
          <div className={css.sortableColumn}>
            <div className={css.sortField}>
              <FormControlLabel
                value={`${column.name}_desc`}
                control={<Radio />}
                label={column.label?.trim() || i18n.t(`${recordType}.${column.name}`)}
              />
            </div>
            <div className={css.sortDir}>
              <ArrowDownwardIcon />
            </div>
          </div>
        </Fragment>
      ))}
    </RadioGroup>
  );
}

SortableColumns.displayName = "SortContainer";

SortableColumns.propTypes = {
  filters: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  sortableColumns: PropTypes.object
};

export default SortableColumns;
