import PropTypes from "prop-types";

import MenuItem from "../menu-item";

const Component = ({ actions, disabledCondtion, handleClose }) =>
  actions.map(action => (
    <MenuItem key={action.name} action={action} disabledCondtion={disabledCondtion} handleClose={handleClose} />
  ));

Component.defaultProps = {
  disabledCondtion: () => {}
};

Component.propTypes = {
  disabledCondtion: PropTypes.func,
  handleClose: PropTypes.func.isRequired
};

export default Component;
