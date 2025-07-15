// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { TableCell, TableRow } from "@mui/material";
import isNil from "lodash/isNil";
import isEmpty from "lodash/isEmpty";
import { cx } from "@emotion/css";

import InsightsTableHeaderSubItems from "../insights-table-header-sub-items";
import { buildGroupedSubItemColumns } from "../../utils";

import css from "./styles.css";
import { NAME } from "./constants";

function InsightsTableHeader({ addEmptyCell = true, columns, headerTitle, subColumnItemsSize }) {
  const groupedSubcolumns = columns.reduce((acc, column) => ({ ...acc, [column.label]: column.items }), {});
  const groupedSubItemColumns = buildGroupedSubItemColumns(columns);
  const classesEmptyCell = cx({ [css.emptyCell]: Boolean(subColumnItemsSize), [css.emptyHeader]: true });
  const hasGroupedColumns = !isEmpty(groupedSubItemColumns);
  const subcolumnsNumber = Object.values(groupedSubcolumns)
    .flat()
    .some(subcolumn => !isNil(subcolumn));

  return (
    <>
      <TableRow className={css.tableRowHeader}>
        {addEmptyCell && !headerTitle && <TableCell className={classesEmptyCell} />}
        {headerTitle && <TableCell>{headerTitle}</TableCell>}
        {columns.map(column => (
          <TableCell key={column.label} colSpan={column.colspan || column.items?.length}>
            {column.label}
          </TableCell>
        ))}
      </TableRow>
      {subcolumnsNumber && (
        <TableRow className={css.tableRowSubHeader}>
          {addEmptyCell && <TableCell className={classesEmptyCell} />}
          {Object.entries(groupedSubcolumns).flatMap(([parent, subcolumns]) =>
            subcolumns.map(subcolumn => (
              <TableCell
                key={`${parent}-${subcolumn}`}
                colSpan={groupedSubItemColumns[`${parent}-${subcolumn}`]?.length}
              >
                {subcolumn}
              </TableCell>
            ))
          )}
        </TableRow>
      )}

      {hasGroupedColumns && <InsightsTableHeaderSubItems groupedSubItemColumns={groupedSubItemColumns} />}
    </>
  );
}

InsightsTableHeader.displayName = NAME;

InsightsTableHeader.propTypes = {
  addEmptyCell: PropTypes.bool,
  columns: PropTypes.array,
  headerTitle: PropTypes.string,
  subColumnItemsSize: PropTypes.number
};

export default InsightsTableHeader;
