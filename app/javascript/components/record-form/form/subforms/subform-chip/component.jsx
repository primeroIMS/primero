import PropTypes from "prop-types";
import clsx from "clsx";
import { Chip } from "@material-ui/core";

import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ label, type, ...rest }) => {
  const classes = clsx({ [css.subformChip]: true, [css[type]]: true });

  return <Chip data-testid="chip" className={classes} label={label} {...rest} />;
};

Component.displayName = NAME;

Component.defaultProps = {
  type: "info"
};

Component.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string
};

export default Component;
