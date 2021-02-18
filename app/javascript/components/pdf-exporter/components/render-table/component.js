import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";

import Table from "../table";

import styles from "./styles.css";

const Component = ({ title, fields, data }) => {
  const css = makeStyles(styles)();

  return (
    <div className={css.group}>
      <h2>{title}</h2>
      <Table fields={fields} record={data} />
    </div>
  );
};

Component.displayName = "RenderTable";

Component.propTypes = {
  data: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  title: PropTypes.string
};

export default Component;
