import PropTypes from "prop-types";

import css from "../styles.css";

function FieldValue({ label, value }) {
  return (
    <div className={css.data}>
      <div>{label}</div>
      <div>{value || "--"}</div>
    </div>
  );
}

FieldValue.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

FieldValue.displayName = "FieldValue";

export default FieldValue;
