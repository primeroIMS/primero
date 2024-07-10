import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";

import ActionButton from "../../../../../action-button";
import DisableOffline from "../../../../../disable-offline";
import { ACTION_BUTTON_TYPES } from "../../../../../action-button/constants";

function Component({ onClick }) {
  return (
    <DisableOffline>
      <ActionButton
        id="delete-button"
        icon={<DeleteIcon />}
        type={ACTION_BUTTON_TYPES.icon}
        cancel
        rest={{ onClick }}
      />
    </DisableOffline>
  );
}

Component.displayName = "DocumentDeleteButton";

Component.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default Component;
