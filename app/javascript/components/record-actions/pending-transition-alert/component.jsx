import PropTypes from "prop-types";
import { fromJS } from "immutable";

import InternalAlert, { SEVERITY } from "../../internal-alert";
import { useI18n } from "../../i18n";

import { NAME } from "./constants";

function Component({ pendingTransitionIds = [] }) {
  const i18n = useI18n();

  if (!pendingTransitionIds.length) {
    return null;
  }

  return (
    <InternalAlert
      items={fromJS([{ message: i18n.t("case.messages.pending_transition_excluded") }])}
      severity={SEVERITY.info}
    />
  );
}

Component.displayName = NAME;

Component.propTypes = {
  pendingTransitionIds: PropTypes.array
};

export default Component;
