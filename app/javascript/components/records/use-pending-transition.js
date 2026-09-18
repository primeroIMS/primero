import { useMemoizedSelector } from "../../libs";
import { useI18n } from "../i18n";
import { currentUser } from "../user/selectors";

import { hasPendingReferral, hasPendingTransfer } from "./utils";

const usePendingTransition = record => {
  const i18n = useI18n();
  const currentUserName = useMemoizedSelector(state => currentUser(state));

  const pendingReferral = hasPendingReferral(record, currentUserName);
  const pendingTransfer = hasPendingTransfer(record, currentUserName);

  const tooltipKey =
    (pendingReferral && "referral.pending_restriction") || (pendingTransfer && "transfer.pending_restriction");

  return {
    hasPendingReferral: pendingReferral,
    hasPendingTransfer: pendingTransfer,
    hasPendingTransition: pendingReferral || pendingTransfer,
    tooltip: tooltipKey ? i18n.t(tooltipKey) : undefined
  };
};

export default usePendingTransition;
