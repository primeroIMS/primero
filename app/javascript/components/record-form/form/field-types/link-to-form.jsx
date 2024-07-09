// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch } from "react-redux";

import ActionButton, { ACTION_BUTTON_TYPES } from "../../../action-button";
import { setSelectedForm } from "../../action-creators";

function LinkToForm({ label, linkToForm }) {
  const dispatch = useDispatch();
  const onClick = () => dispatch(setSelectedForm(linkToForm));

  return (
    <ActionButton
      id="link-t0-form-btn"
      icon={<VisibilityIcon />}
      text={label}
      type={ACTION_BUTTON_TYPES.default}
      outlined
      keepTextOnMobile
      noTranslate
      rest={{
        color: "primary",
        onClick
      }}
    />
  );
}

LinkToForm.displayName = "LinkToForm";

LinkToForm.propTypes = {
  label: PropTypes.string.isRequired,
  linkToForm: PropTypes.string.isRequired
};

export default LinkToForm;
