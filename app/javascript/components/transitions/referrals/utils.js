import { object, string } from "yup";

import { ACCEPTED, REJECTED, REVOKED } from "../../../config";

import { CREATE_CASE, DONE } from "./constants";

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

export const referralHeader = (i18n, recordType, referralType, moduleID) => {
  const headers = {
    [ACCEPTED]: "referral_accepted_header",
    [CREATE_CASE]: "referral_create_case_header"
  };

  if (headers[referralType]) {
    return i18n.t(`${recordType}.${headers[referralType]}`, moduleID ? { module_id: moduleID } : {});
  }

  return "";
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
