import PropTypes from "prop-types";
import clsx from "clsx";
import { TableCell, TableRow } from "@material-ui/core";

import generateKey from "../../utils";

import css from "./styles.css";
import { NAME } from "./constants";

const Component = ({ values, subColumnItemsSize }) => {
  return values.map(value => {
    const { colspan, row } = value;
    const classes = clsx({ [css.tableRow]: colspan !== 0, [css.tableRowValues]: true });

    return (
      <TableRow className={classes} key={`${generateKey("data")}`}>
        {row.map((rowData, index) => {
          const cellClass =
            subColumnItemsSize &&
            clsx({
              [css.tableCell]: index % subColumnItemsSize === 0 && index !== 0,
              [css.tableCellSize]: Boolean(subColumnItemsSize) && index > 0
            });

          return (
            <TableCell colSpan={colspan} key={generateKey(value)} className={cellClass}>
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
