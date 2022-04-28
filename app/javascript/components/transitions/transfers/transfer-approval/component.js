import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { object, string } from "yup";

import { useApp } from "../../../application";
import { useI18n } from "../../../i18n";
import ActionDialog from "../../../action-dialog";
import { ACCEPTED, REJECTED, ACCEPT, REJECT, MODES } from "../../../../config";
import Form, { FieldRecord, FormSectionRecord, whichFormMode, TEXT_AREA } from "../../../form";
import { selectRecord } from "../../../records";
import { useMemoizedSelector } from "../../../../libs";
import { getTransitionById } from "../../selectors";

import { approvalTransfer } from "./action-creators";
import { FORM_ID, NAME } from "./constants";

const Component = ({
  openTransferDialog,
  close,
  approvalType,
  dialogName,
  recordId,
  recordType,
  pending,
  setPending,
  transferId
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { currentUserName } = useApp();
  const requiredMessage = i18n.t("form_section.required_field", { field: i18n.t("transfer.rejected_reason") });
  const initialValues = { rejected_reason: "" };
  const validations = object().shape({ rejected_reason: string().nullable().required(requiredMessage) });
  const formMode = whichFormMode(MODES.edit);

  const record = useMemoizedSelector(state => selectRecord(state, { isEditOrShow: true, recordType, id: recordId }));
  const transfer = useMemoizedSelector(state => getTransitionById(state, transferId));
  const isCurrentUser = transfer.transitioned_to === currentUserName;

  const handleCancel = event => {
    if (event) {
      event.stopPropagation();
    }

    close();
  };

  const message =
    approvalType === ACCEPTED
      ? i18n.t(`${recordType}.transfer_accepted_success`)
      : i18n.t(`${recordType}.transfer_accepted_rejected`, {
          record_id: record.get("case_id_display")
        });

  const handleOk = data => {
    setPending(true);

    dispatch(
      approvalTransfer({
        body: { data: { ...data, status: approvalType } },
        dialogName,
        message,
        failureMessage: i18n.t(`${recordType}.request_approval_failure`),
        recordId,
        recordType,
        transferId
      })
    );
  };

  const successButtonProps = {
    color: "primary",
    variant: "contained",
    autoFocus: true,
    form: FORM_ID,
    type: "submit"
  };

  const renderRejectedReason = approvalType === REJECTED && (
    <Form
      formID={FORM_ID}
      onSubmit={handleOk}
      formMode={formMode}
      initialValues={initialValues}
      validations={validations}
      formSections={[
        FormSectionRecord({
          unique_id: "rejected_form",
          fields: [
            FieldRecord({
              display_name: i18n.t(`${recordType}.transfer_reject_reason_label`),
              name: "rejected_reason",
              type: TEXT_AREA,
              autoFocus: true
            })
          ]
        })
      ]}
    />
  );

  const dialogContent = (
    <>
      <p>
        {i18n.t(`${recordType}.transfer${isCurrentUser ? "" : "_managed_user"}_${approvalType}`, {
          transitioned_to: transfer.transitioned_to
        })}
      </p>
      {renderRejectedReason}
    </>
  );

  const buttonLabel = approvalType === ACCEPTED ? ACCEPT : REJECT;

  return (
    <ActionDialog
      open={openTransferDialog}
      successHandler={approvalType === ACCEPTED && handleOk}
      cancelHandler={handleCancel}
      dialogTitle=""
      pending={pending}
      omitCloseAfterSuccess
      confirmButtonLabel={i18n.t(`buttons.${buttonLabel}`)}
      confirmButtonProps={successButtonProps}
      onClose={close}
    >
      {dialogContent}
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  openTransferDialog: false
};

Component.propTypes = {
  approvalType: PropTypes.string,
  close: PropTypes.func,
  dialogName: PropTypes.string,
  openTransferDialog: PropTypes.bool,
  pending: PropTypes.bool,
  recordId: PropTypes.string,
  recordType: PropTypes.string,
  setPending: PropTypes.func,
  transferId: PropTypes.string
};

export default Component;
