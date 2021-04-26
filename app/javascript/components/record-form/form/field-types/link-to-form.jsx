import PropTypes from "prop-types";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useDispatch } from "react-redux";

import ActionButton, { ACTION_BUTTON_TYPES } from "../../../action-button";
import { setSelectedForm } from "../../action-creators";

const LinkToForm = ({ label, linkToForm }) => {
  const dispatch = useDispatch();
  const onClick = () => dispatch(setSelectedForm(linkToForm));

  return (
    <ActionButton
      icon={<VisibilityIcon />}
      text={label}
      type={ACTION_BUTTON_TYPES.default}
      outlined
      keepTextOnMobile
      rest={{
        color: "primary",
        onClick
      }}
    />
  );
};

LinkToForm.displayName = "LinkToForm";

LinkToForm.propTypes = {
  label: PropTypes.string.isRequired,
  linkToForm: PropTypes.string.isRequired
};

export default LinkToForm;
