import React, { useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import Form from "../../../form";
import { useI18n } from "../../../i18n";
import { RECORD_TYPES } from "../../../../config";
import { getRecordForms } from "../../../record-form/selectors";
import { saveReferral } from "../action-creators";
import { getErrorsByTransitionType } from "../selectors";

import { REFERRAL_FIELD, TRANSITION_TYPE } from "./constants";
import { form, validations } from "./form";
import renderPdfExporter from "./components/render-pdf-exporter";

const Referrals = ({
  referralRef,
  providedConsent,
  canConsentOverride,
  record,
  recordForms,
  recordType,
  setDisabled,
  setPending
}) => {
  const i18n = useI18n();
  const pdfExporterRef = useRef();
  const forms = form(i18n, { providedConsent, recordType });
  const dispatch = useDispatch();

  const formErrors = useSelector(state => getErrorsByTransitionType(state, TRANSITION_TYPE));
  const recordTypesForms = useSelector(state =>
    getRecordForms(state, {
      recordType: RECORD_TYPES[recordType],
      primeroModule: record?.get("module_id")
    })
  );

  const handleSubmit = values => {
    const recordID = record.get("id");

    setPending(true);

    if (values.remoteSystem) {
      pdfExporterRef.current.savePdf({ setPending, close: () => {}, values });
    } else {
      dispatch(
        saveReferral(
          recordID,
          recordType,
          {
            data: {
              ...values,
              consent_overridden: canConsentOverride || values[REFERRAL_FIELD]
            }
          },
          i18n.t("referral.success", { record_type: recordType, id: recordID })
        )
      );
    }
  };

  const handleValid = valid => setDisabled(valid);

  return (
    <>
      <Form
        useFormMode="onBlur"
        formSections={forms}
        onSubmit={handleSubmit}
        ref={referralRef}
        validations={validations}
        formErrors={formErrors}
        onValid={handleValid}
        initialValue={{
          consent_individual_transfer: providedConsent
        }}
        renderBottom={renderPdfExporter({ record, recordTypesForms, pdfExporterRef })}
      />
    </>
  );
};

Referrals.displayName = "Referrals";

Referrals.propTypes = {};

export default Referrals;
