// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import SearchIcon from "@material-ui/icons/Search";

import ActionButton, { ACTION_BUTTON_TYPES } from "../../../action-button";

function Component({ formId }) {
  return (
    <ActionButton
      icon={<SearchIcon />}
      text="navigation.search"
      type={ACTION_BUTTON_TYPES.default}
      rest={{
        form: formId,
        type: "submit"
      }}
    />
  );
}

Component.displayName = "SearchButton";

Component.propTypes = {
  formId: PropTypes.string.isRequired
};

export default Component;
