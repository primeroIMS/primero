// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SearchIcon from "@mui/icons-material/Search";

import css from "../../record-form/form/subforms/styles.css";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../action-button";
import { FORM_ID } from "../constants";

function Component({ handleCancel, children }) {
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
      {children}
    </>
  );
}

Component.displayName = "SearchPanel";

Component.propTypes = {
  children: PropTypes.node.isRequired,
  handleCancel: PropTypes.func.isRequired
};

export default Component;
