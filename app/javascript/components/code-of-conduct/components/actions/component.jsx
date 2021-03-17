import PropTypes from "prop-types";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";

import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";

import { NAME } from "./constants";

const Component = ({ css, i18n, handleAccept, handleCancel, updatingCodeOfConduct, codeOfConductAccepted }) => {
  return (
    <div className={css.actions}>
      <ActionButton
        icon={<ClearIcon />}
        text={i18n.t("buttons.cancel")}
        type={ACTION_BUTTON_TYPES.default}
        isTransparent
        rest={{
          onClick: handleCancel
        }}
      />
      <ActionButton
        icon={<CheckIcon />}
        text={i18n.t("buttons.accept")}
        type={ACTION_BUTTON_TYPES.default}
        rest={{
          onClick: handleAccept,
          pending: updatingCodeOfConduct,
          disabled: updatingCodeOfConduct || codeOfConductAccepted
        }}
      />
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  codeOfConductAccepted: PropTypes.bool,
  css: PropTypes.object,
  handleAccept: PropTypes.func,
  handleCancel: PropTypes.func,
  i18n: PropTypes.object,
  updatingCodeOfConduct: PropTypes.bool
};

export default Component;
