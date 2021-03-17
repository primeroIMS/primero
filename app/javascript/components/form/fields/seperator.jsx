import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

import styles from "./styles.css";

const Seperator = ({ commonInputProps }) => {
  const { label } = commonInputProps;
  const css = makeStyles(styles)();

  if (!label) {
    return <div className={css.separator} />;
  }

  return <Typography variant="h6">{label}</Typography>;
};

Seperator.displayName = "Seperator";

Seperator.propTypes = {
  commonInputProps: PropTypes.shape({
    label: PropTypes.string
  })
};

export default Seperator;
