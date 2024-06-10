// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import clsx from "clsx";
import { Button } from "@mui/material";

import { useI18n } from "../../../../../i18n";
import { displayNameHelper } from "../../../../../../libs";
import LockedIcon from "../../../../../locked-icon";
import css from "../fields-list/styles.css";

import { NAME } from "./constants";

function Component({ field, handleClick, isNotEditable }) {
  const i18n = useI18n();
  const icon = isNotEditable ? <LockedIcon /> : <span />;
  const className = clsx({ [css.editable]: !isNotEditable });

  return (
    <>
      {icon}
      <Button id="field-name-button" className={className} onClick={handleClick}>
        {displayNameHelper(field.get("display_name"), i18n.locale)}
      </Button>
    </>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  field: PropTypes.object.isRequired,
  handleClick: PropTypes.func,
  isNotEditable: PropTypes.bool
};

export default Component;
