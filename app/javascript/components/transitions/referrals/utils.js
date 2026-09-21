import { object, string } from "yup";

import { ACCEPTED, REJECTED, REVOKED } from "../../../config";

import { CREATE_CASE, DONE } from "./constants";

const REFERRAL_HEADERS = Object.freeze({
  [ACCEPTED]: "referral_accepted_header",
  [CREATE_CASE]: "referral_create_case_header"
});

const EXTERNAL_REFERRAL_HEADERS = Object.freeze({
  [ACCEPTED]: "external_referral_accepted_header",
  [REJECTED]: "external_referral_rejected_header"
});

const EXTERNAL_REFERRAL_MESSAGES = Object.freeze({
  [ACCEPTED]: "external_referral_accepted",
  [REJECTED]: "external_referral_rejected"
});

const EXTERNAL_REFERRAL_BUTTON = Object.freeze({
  [ACCEPTED]: "mark_accepted",
  [REJECTED]: "mark_rejected"
});

export const referralAgencyName = (transition, agencies) => {
  if (!transition.remote && transition.transitioned_to_agency) {
    return agencies.find(agency => agency.id === transition.transitioned_to_agency).display_text;
  }

  // eslint-disable-next-line camelcase
  return transition?.transitioned_to_agency;
};

export const mapRecordForCaseCreation = (record, creationMap) => {
  if (!creationMap) return {};

  return creationMap.fields.reduce((prev, current) => {
    return { ...prev, [current.target]: record.get(current.source, null) };
  }, {});
};

export const referralHeaderKey = ({ recordType, remote, status }) => {
  const header = remote ? EXTERNAL_REFERRAL_HEADERS[status] : REFERRAL_HEADERS[status];

  return header ? `${recordType}.${header}` : null;
};

export const referralMessageKey = ({ recordType, remote, status }) => {
  const externalMessage = EXTERNAL_REFERRAL_MESSAGES[status];

  return remote && externalMessage ? `${recordType}.${externalMessage}` : `${recordType}.referral_${status}`;
};

export const referralConfirmButtonKey = ({ remote, status }) => {
  const externalButton = EXTERNAL_REFERRAL_BUTTON[status];

  if (remote && externalButton) {
    return `buttons.${externalButton}`;
  }

  return status === DONE ? "buttons.done" : "buttons.ok";
};

export const createValidationSchema = (status, serviceRecordId, requiredMessages) => {
  if (status === REJECTED) {
    return object().shape({ rejected_reason: string().nullable().required(requiredMessages.rejected_reason) });
  }

  if ([DONE, REVOKED].includes(status)) {
    return object().shape({
      reason_not_successful: string().when("success_status", {
        is: "not_successful",
        then: string().nullable().required(requiredMessages.reason_not_successful)
      }),
      rejection_note: string().nullable(),
      service_implemented: serviceRecordId
        ? string().nullable().required(requiredMessages.service_implemented)
        : string().nullable(),
      success_status: string().nullable().required(requiredMessages.success_status)
    });
  }

  return null;
};
