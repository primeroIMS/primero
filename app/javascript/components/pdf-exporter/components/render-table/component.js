import PropTypes from "prop-types";

import Table from "../table";

import css from "./styles.css";

function Component({ title, fields, data, recordType }) {
  return (
    <div className={css.group}>
      <h2>{title}</h2>
      <Table fields={fields} record={data} recordType={recordType} />
    </div>
  );
}

Component.displayName = "RenderTable";

Component.propTypes = {
  data: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  recordType: PropTypes.string,
  title: PropTypes.string
};

export default Component;
