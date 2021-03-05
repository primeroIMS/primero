import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import { NAME } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const DisplayData = ({ label, value }) => {
  const css = useStyles();

  return (
    <>
      <p className={css.label}>{label}</p>
      <p>{value || "--"}</p>
    </>
  );
};

DisplayData.displayName = NAME;

DisplayData.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default DisplayData;
