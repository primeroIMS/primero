import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";


import css from "./styles.css";

const Seperator = ({ commonInputProps }) => {
  const { label } = commonInputProps;


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
