import PropTypes from "prop-types";
import TableCell from "@material-ui/core/TableCell";

const Component = ({ css, columnMeta, handleToggleColumn }) => {
  const handleClick = () => handleToggleColumn(columnMeta.index);

  return (
    <TableCell key={columnMeta.index} className={css.photoHeader} onClick={handleClick}>
      {columnMeta.name}
    </TableCell>
  );
};

Component.propTypes = {
  columnMeta: PropTypes.object,
  css: PropTypes.object,
  handleToggleColumn: PropTypes.func
};

Component.displayName = "PhotoColumnHeader";

export default Component;
