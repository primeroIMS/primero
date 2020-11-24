import React from "react";
import PropTypes from "prop-types";
import TableCell from "@material-ui/core/TableCell";

const Component = ({ css, columnMeta, handleToggleColumn }) => (
  <TableCell key={columnMeta.index} className={css.photoHeader} onClick={() => handleToggleColumn(columnMeta.index)}>
    {columnMeta.name}
  </TableCell>
);

Component.propTypes = {
  columnMeta: PropTypes.object,
  css: PropTypes.object,
  handleToggleColumn: PropTypes.func
};

Component.displayName = "PhotoColumnHeader";

export default Component;
