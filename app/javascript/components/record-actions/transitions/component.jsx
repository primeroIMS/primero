import { useRef, useState } from "react";
import PropTypes from "prop-types";

import { useI18n } from "../../i18n";
import submitForm from "../../../libs/submit-form";
import { TRANSITIONS_TYPES } from "../../transitions/constants";
import { getRecords } from "../../index-table";
import { ASSIGN_DIALOG, TRANSFER_DIALOG, REFER_DIALOG } from "../constants";
import { useMemoizedSelector } from "../../../libs";
import { usePermissions } from "../../user";
import { RESOURCES, CONSENT_OVERRIDE } from "../../../libs/permissions";

import { NAME, REFERRAL_FORM_ID, TRANSFER_FORM_ID } from "./constants";
import { hasProvidedConsent } from "./components/utils";
import { ReassignForm, TransitionDialog, Transfers } from "./components";
import Referrals from "./referrals/component";

const Transitions = ({
  close,
  open,
  currentDialog,
  record,
  recordType,
  pending,
  setPending,
  currentPage,
  selectedRecords,
  mode
}) => {
  const i18n = useI18n();
  const providedConsent = (record && hasProvidedConsent(record)) || false;
  const assignFormikRef = useRef();
  const [disabledReferButton, setDisabledReferButton] = useState(false);
  const [disabledTransferButton, setDisabledTransferButton] = useState(false);

  const transitionDialogOpen = dialog => currentDialog === dialog && open;

  const isTransferDialogOpen = transitionDialogOpen(TRANSFER_DIALOG);
  const isReferDialogOpen = transitionDialogOpen(REFER_DIALOG);
  const isAssignDialogOpen = transitionDialogOpen(ASSIGN_DIALOG);
  const canConsentOverride = usePermissions(RESOURCES.cases, CONSENT_OVERRIDE);

  const records = useMemoizedSelector(state => getRecords(state, recordType)).get("data");

  const selectedIds =
    selectedRecords && records
      ? records
          .toJS()
          .filter((_r, i) => selectedRecords[currentPage]?.includes(i))
          .map(r => r.id)
      : [];

  const commonDialogProps = {
    omitCloseAfterSuccess: true,
    pending,
    record,
    recordType,
    selectedIds
  };

  const commonTransitionProps = {
    canConsentOverride,
    providedConsent,
    recordType,
    record,
    setPending,
    selectedIds,
    mode
  };

  // eslint-disable-next-line react/no-multi-comp, react/display-name
  const transitionComponent = () => {
    if (isTransferDialogOpen) {
      return (
        <Transfers
          {...commonTransitionProps}
          isBulkTransfer={false}
          disabled={disabledTransferButton}
          setDisabled={setDisabledTransferButton}
        />
      );
    }
    if (isReferDialogOpen) {
      return (
        <Referrals
          {...commonTransitionProps}
          formID={REFERRAL_FORM_ID}
          disabled={disabledReferButton}
          setDisabled={setDisabledReferButton}
          handleClose={close}
        />
      );
    }
    if (isAssignDialogOpen) {
      return <ReassignForm {...commonTransitionProps} assignRef={assignFormikRef} />;
    }

    return null;
  };

  const renderTransitionForm = () => {
    if (isReferDialogOpen) {
      const referralOnClose = () => {
        setDisabledReferButton(false);
        close();
      };

      return {
        onClose: referralOnClose,
        confirmButtonLabel: i18n.t("buttons.referral"),
        open: isReferDialogOpen,
        transitionType: TRANSITIONS_TYPES.referral,
        enabledSuccessButton: disabledReferButton || providedConsent,
        omitCloseAfterSuccess: true,
        confirmButtonProps: {
          type: "submit",
          form: REFERRAL_FORM_ID
        }
      };
    }

    if (isTransferDialogOpen) {
      const transferOnClose = () => {
        setDisabledTransferButton(false);
        close();
      };

      return {
        onClose: transferOnClose,
        confirmButtonLabel: i18n.t("buttons.transfer"),
        open: isTransferDialogOpen,
        transitionType: TRANSITIONS_TYPES.transfer,
        enabledSuccessButton: disabledTransferButton || providedConsent,
        confirmButtonProps: { type: "submit", form: TRANSFER_FORM_ID }
      };
    }

    if (isAssignDialogOpen) {
      const successHandler = () => submitForm(assignFormikRef);

      return {
        onClose: close,
        confirmButtonLabel: i18n.t("buttons.save"),
        open: isAssignDialogOpen,
        successHandler,
        transitionType: TRANSITIONS_TYPES.reassign
      };
    }

    return null;
  };

  const customProps = renderTransitionForm();

  if (Object.is(customProps, null)) {
    return null;
  }

  return (
    <TransitionDialog {...customProps} {...commonDialogProps}>
      {transitionComponent()}
    </TransitionDialog>
  );
};

Transitions.displayName = NAME;

Transitions.defaultProps = {
  open: false
};

Transitions.propTypes = {
  close: PropTypes.func,
  currentDialog: PropTypes.string,
  currentPage: PropTypes.number,
  mode: PropTypes.object,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedRecords: PropTypes.object,
  setPending: PropTypes.func
};

export default Transitions;
