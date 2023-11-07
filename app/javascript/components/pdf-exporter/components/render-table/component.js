// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import Table from "../table";

import css from "./styles.css";

const Component = ({ title, fields, data }) => {
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
