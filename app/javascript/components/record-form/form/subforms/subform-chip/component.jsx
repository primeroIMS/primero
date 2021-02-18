import PropTypes from "prop-types";
import clsx from "clsx";
import { Chip } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ label, type, ...rest }) => {
  const css = makeStyles(styles)();

  return <Chip className={clsx({ [css.subformChip]: true, [css[type]]: true })} label={label} {...rest} />;
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
