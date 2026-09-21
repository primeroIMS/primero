import PropTypes from "prop-types";

import { useI18n } from "../../../../../i18n";
import ActionButton from "../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../action-button/constants";

function ReferAction({ index, handleReferral, values, disabled = false, tooltip }) {
  const i18n = useI18n();
  const id = `refer-option-${index}`;

  return (
    <ActionButton
      id={id}
      key={id}
      text={values[index].service_status_referred ? i18n.t("buttons.referral_again") : i18n.t("buttons.referral")}
      type={ACTION_BUTTON_TYPES.default}
      noTranslate
      disabled={disabled}
      tooltip={tooltip}
      size="small"
      rest={{ onClick: () => handleReferral() }}
    />
  );
}

ReferAction.displayName = "ReferAction";

ReferAction.propTypes = {
  disabled: PropTypes.bool,
  handleReferral: PropTypes.func,
  index: PropTypes.number,
  tooltip: PropTypes.string,
  values: PropTypes.object
};

export default ReferAction;
