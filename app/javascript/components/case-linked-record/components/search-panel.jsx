// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SearchIcon from "@mui/icons-material/Search";

import css from "../../record-form/form/subforms/styles.css";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../action-button";
import { FORM_ID } from "../constants";

function Component({ handleCancel, searchFormComponent }) {
  return (
    <>
      <div className={css.subformFieldArrayContainer}>
        <ActionButton
          type={ACTION_BUTTON_TYPES.default}
          text="case.back_to_case"
          rest={{ onClick: handleCancel }}
          icon={<ArrowBackIosIcon />}
        />
        <ActionButton
          type={ACTION_BUTTON_TYPES.default}
          text="navigation.search"
          rest={{ form: FORM_ID, type: "submit" }}
          icon={<SearchIcon />}
        />
      </div>
      {searchFormComponent}
    </>
  );
}

Component.displayName = "SearchPanel";

Component.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  searchFormComponent: PropTypes.node.isRequired
};

export default Component;
