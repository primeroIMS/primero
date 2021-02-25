import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

import { NAME } from "./constants";

const Component = ({ addField, field, removeField, selected }) => {
  const onAdd = () => {
    addField(field);
  };

  const onRemove = () => {
    removeField(field);
  };

  return selected ? (
    <IconButton onClick={onRemove}>
      <RemoveIcon />
    </IconButton>
  ) : (
    <IconButton onClick={onAdd}>
      <AddIcon />
    </IconButton>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  selected: false
};

Component.propTypes = {
  addField: PropTypes.func.isRequired,
  field: PropTypes.object.isRequired,
  removeField: PropTypes.func.isRequired,
  selected: PropTypes.bool
};

export default Component;
