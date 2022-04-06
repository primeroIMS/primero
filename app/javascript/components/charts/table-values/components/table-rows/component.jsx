import PropTypes from "prop-types";
import clsx from "clsx";
import { TableCell, TableRow } from "@material-ui/core";

import generateKey from "../../utils";

import css from "./styles.css";
import { NAME } from "./constants";

const Component = ({ values }) => {
  // console.log("===values==>", values);

  return values.map(value => {
    const { colspan, row } = value;
    const classes = clsx({ [css.tableRow]: colspan !== 0, [css.tableRowValues]: true });

    // console.log("===row==>", row);

    return (
      <TableRow className={classes} key={`${generateKey("data")}`}>
        {row.map(rowData => {
          return (
            <TableCell colSpan={colspan} key={generateKey(value)}>
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
  values: PropTypes.array
};

export default Component;
