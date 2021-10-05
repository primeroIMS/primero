import PropTypes from "prop-types";


import { NAME } from "./constants";
import css from "./styles.css";



const DisplayData = ({ label, value }) => {
  

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
