// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { batch, useDispatch } from "react-redux";
import { InputLabel, MenuItem, Select } from "@mui/material";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import { fetchAlerts } from "../../nav/action-creators";
import { getRecordAlerts, saveRecord } from "../../records";
import { currentUser } from "../../user";
import { useApp } from "../../application";
import { useMemoizedSelector } from "../../../libs";
import useOptions from "../../form/use-options";
import includeCPByDefault from "../../../libs/include-cp-by-default";

import { approvalRecord } from "./action-creators";
import ApprovalForm from "./approval-form";
import { APPROVAL_TYPE_LOOKUP, CASE_PLAN, NAME } from "./constants";
import css from "./styles.css";

function Component({
  close,
  open,
  subMenuItems,
  record,
  recordType,
  pending,
  setPending,
  approvalType,
  confirmButtonLabel
}) {
  const i18n = useI18n();
  const { approvalsLabels, userModules } = useApp();
  const dispatch = useDispatch();

  const startRequestType = subMenuItems?.[0]?.value;
  const [requestType, setRequestType] = useState(startRequestType);
  const [approval, setApproval] = useState("approved");
  const [comment, setComment] = useState("");
  const [renderCasePlan, setRenderCasePlan] = useState(false);
  const [typeOfCasePlan, setTypeOfCasePlan] = useState("");

  const recordAlerts = useMemoizedSelector(state => getRecordAlerts(state, recordType));
  const username = useMemoizedSelector(state => currentUser(state));

  const alertTypes = useOptions({ source: APPROVAL_TYPE_LOOKUP });

  const showTypeOfCasePlan = userModules
    .filter(userModule => includeCPByDefault(userModule.unique_id))
    // eslint-disable-next-line camelcase
    ?.first()?.options?.selectable_approval_types;

  useEffect(() => {
    if (requestType === CASE_PLAN) {
      setRenderCasePlan(true);
      setTypeOfCasePlan("");
    } else {
      setRenderCasePlan(false);
    }
  }, [requestType]);

  const handleChangeType = event => {
    setRequestType(event.target.value);
  };
  const handleChangeApproval = event => {
    setApproval(event.target.value);
  };
  const handleChangeComment = event => {
    setComment(event.target.value);
  };
  const handleChangeTypeOfCasePlan = event => setTypeOfCasePlan(event.target.value);
  const handleCancel = () => {
    close();
    setRequestType(startRequestType);
    setApproval("approved");
    setComment("");
  };

  const actionBody = { data: {} };

  actionBody.data.approval_status = approvalType === "request" ? "requested" : approval;

  if (comment !== "") {
    actionBody.data.notes = comment;
  }

  if (typeOfCasePlan) {
    actionBody.data.approval_type = typeOfCasePlan;
  }

  const message =
    approvalType === "request"
      ? `${recordType}.request_approval_success_${requestType}`
      : `${recordType}.${approval}_success_${requestType}`;
  const handleSubmit = () => {
    setPending(true);

    const approvalLabels = record
      ? approvalsLabels.getIn([record.get("module_id"), requestType]) || approvalsLabels.getIn(["default", requestType])
      : approvalsLabels.getIn(["default", requestType]);

    batch(async () => {
      await dispatch(
        approvalRecord({
          recordType,
          recordId: record.get("id"),
          approvalId: requestType,
          body: actionBody,
          message: i18n.t(message, {
            approval_label: approvalLabels
          }),
          messageFromQueue: i18n.t("offline_submitted_changes"),
          currentUser: username,
          failureMessage: i18n.t(`${recordType}.request_approval_failure`)
        })
      );

      if (typeOfCasePlan) {
        await dispatch(
          saveRecord(
            recordType,
            "update",
            { data: { case_plan_approval_type: typeOfCasePlan } },
            record.get("id"),
            "",
            i18n.t("offline_submitted_changes"),
            false,
            false
          )
        );
      }

      if (recordAlerts?.size <= 0) {
        dispatch(fetchAlerts());
      }
    });
  };

  const selectOptions = subMenuItems.map(option => (
    <MenuItem key={option.value} value={option.value}>
      {option.name}
    </MenuItem>
  ));

  const typeOfCasePlanOptions = alertTypes.map(alertType => (
    <MenuItem key={alertType.id} value={alertType.id}>
      {alertType.display_text}
    </MenuItem>
  ));

  const selectTypeOfCasePlan = showTypeOfCasePlan && renderCasePlan && (
    <div className={css.field}>
      <InputLabel>{i18n.t("cases.request_approval_type_of_case_plan")}</InputLabel>
      <Select
        id="outlined-select-case-plan-type"
        fullWidth
        value={typeOfCasePlan}
        onChange={handleChangeTypeOfCasePlan}
        variant="outlined"
      >
        {typeOfCasePlanOptions}
      </Select>
    </div>
  );

  const requestDialogContent = (
    <>
      <form noValidate autoComplete="off" className={css.centerForm}>
        <div className={css.field}>
          <InputLabel>{i18n.t(`${recordType}.request_approval_select`)}</InputLabel>
          <Select
            id="outlined-select-approval-native"
            fullWidth
            value={requestType}
            onChange={handleChangeType}
            variant="outlined"
          >
            {selectOptions}
          </Select>
        </div>
        {selectTypeOfCasePlan}
      </form>
    </>
  );

  const approvalsDisabled = isEmpty(selectOptions);

  const approvalDialogContent = ApprovalForm({
    approval,
    close,
    handleChangeApproval,
    handleChangeComment,
    handleChangeType,
    requestType,
    selectOptions,
    disabled: approvalsDisabled
  });

  const dialogContent = approvalType === "approval" ? approvalDialogContent : requestDialogContent;
  const enabledSuccessButton = approvalType === "approval" ? !approvalsDisabled : true;

  return (
    <ActionDialog
      open={open}
      dialogTitle=""
      successHandler={handleSubmit}
      cancelHandler={handleCancel}
      omitCloseAfterSuccess
      maxSize="xs"
      pending={pending}
      enabledSuccessButton={enabledSuccessButton}
      confirmButtonLabel={confirmButtonLabel}
    >
      {dialogContent}
    </ActionDialog>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  approvalType: PropTypes.string,
  close: PropTypes.func,
  confirmButtonLabel: PropTypes.string,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string,
  setPending: PropTypes.func,
  subMenuItems: PropTypes.array
};

export default Component;
