import PropTypes from "prop-types";
import clsx from "clsx";
import { TableCell, TableRow } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

import generateKey from "../../utils";

import styles from "./styles.css";
import { NAME } from "./constants";

const useStyles = makeStyles(styles);

const Component = ({ values }) => {
  const css = useStyles();

  return values.map(value => {
    const { colspan, row } = value;
    const classes = clsx({ [css.tableRow]: colspan !== 0, [css.tableRowValues]: true });

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
