import PropTypes from "prop-types";
import { cx } from "@emotion/css";
import { Button } from "@mui/material";

import { useI18n } from "../../../../../i18n";
import { displayNameHelper } from "../../../../../../libs";
import LockedIcon from "../../../../../locked-icon";
import css from "../fields-list/styles.css";

import { NAME } from "./constants";

function Component({ canManage, field, handleClick, isNotEditable }) {
  const i18n = useI18n();
  const icon = isNotEditable ? <LockedIcon /> : <span />;
  const className = cx({ [css.editable]: !isNotEditable });

  return (
    <>
      {icon}
      <Button
        id="field-name-button"
        className={className}
        disabled={isNotEditable && !canManage}
        onClick={canManage || (!canManage && !isNotEditable) ? handleClick : undefined}
      >
        {displayNameHelper(field.get("display_name"), i18n.locale)}
      </Button>
    </>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  canManage: PropTypes.bool,
  field: PropTypes.object.isRequired,
  handleClick: PropTypes.func,
  isNotEditable: PropTypes.bool
};

export default Component;
