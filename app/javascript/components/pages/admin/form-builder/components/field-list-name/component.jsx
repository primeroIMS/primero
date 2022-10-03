import PropTypes from "prop-types";
import clsx from "clsx";
import { Button } from "@material-ui/core";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

import { useI18n } from "../../../../../i18n";
import { displayNameHelper } from "../../../../../../libs";
import css from "../fields-list/styles.css";

import { NAME } from "./constants";

function Component({ field, handleClick, isNotEditable }) {
  const i18n = useI18n();
  const icon = isNotEditable ? <VpnKeyIcon className={css.rotateIcon} /> : <span />;
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
