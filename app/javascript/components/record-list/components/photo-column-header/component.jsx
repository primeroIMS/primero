import PropTypes from "prop-types";
import TableCell from "@material-ui/core/TableCell";

const Component = ({ css, columnMeta, handleToggleColumn, i18n, recordType }) => {
  const handleClick = () => handleToggleColumn(columnMeta.index);

  return (
    <TableCell key={columnMeta.index} className={css.photoHeader} onClick={handleClick}>
      {i18n.t(`${recordType}.${columnMeta.name}`)}
    </TableCell>
  );
};

Component.propTypes = {
  columnMeta: PropTypes.object,
  css: PropTypes.object,
  handleToggleColumn: PropTypes.func,
  i18n: PropTypes.object,
  recordType: PropTypes.string
};

Component.displayName = "PhotoColumnHeader";

export default Component;
