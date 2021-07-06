import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { fromJS } from "immutable";
import omit from "lodash/omit";
import startCase from "lodash/startCase";

import Form, { OPTION_TYPES } from "../../../form";
import { useI18n } from "../../../i18n";
import { RECORD_TYPES } from "../../../../config";
import { getRecordForms } from "../../../record-form/selectors";
import { saveReferral } from "../action-creators";
import { getErrorsByTransitionType } from "../selectors";
import { setServiceToRefer } from "../../../record-form/action-creators";
import { getServiceToRefer } from "../../../record-form";
import PdfExporter from "../../../pdf-exporter";
import { useMemoizedSelector } from "../../../../libs";

import { getReferralSuccess } from "./selectors";
import { mapServiceFields, customReferralFormProps } from "./utils";
import {
  TRANSITION_TYPE,
  SERVICE_EXTERNAL_REFERRAL,
  FIELDS,
  CUSTOM_EXPORT_FILE_NAME_FIELD,
  OMITTED_SUBMISSION_FIELDS
} from "./constants";
import { form, validations } from "./form";

const Referrals = ({
  formID,
  providedConsent,
  canConsentOverride,
  record,
  recordType,
  setDisabled,
  setPending,
  handleClose
}) => {
  const i18n = useI18n();
  const pdfExporterRef = useRef();
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({});

  const submittedSuccessfully = useMemoizedSelector(state => getReferralSuccess(state));
  const serviceToRefer = useMemoizedSelector(state => getServiceToRefer(state));
  const formErrors = useMemoizedSelector(state => getErrorsByTransitionType(state, TRANSITION_TYPE));
  const recordTypesForms = useMemoizedSelector(state =>
    getRecordForms(state, {
      recordType: RECORD_TYPES[recordType],
      primeroModule: record?.get("module_id")
    })
  );

  const isExternalReferralFromService = serviceToRefer.get(SERVICE_EXTERNAL_REFERRAL, false);
  const isReferralFromService = !serviceToRefer.isEmpty();
  const referralFromService = mapServiceFields(serviceToRefer, isExternalReferralFromService);

  const forms = form({
    i18n,
    canConsentOverride,
    providedConsent,
    recordType,
    recordModuleID: record?.get("module_id"),
    isReferralFromService,
    isExternalReferralFromService
  });

  const handleSubmit = values => {
    const recordID = record.get("id");

    setPending(true);
    setFormValues(values);

    dispatch(
      saveReferral(
        recordID,
        recordType,
        {
          data: {
            ...omit(values, OMITTED_SUBMISSION_FIELDS),
            ...(!providedConsent && { consent_overridden: values[FIELDS.CONSENT_INDIVIDUAL_TRANSFER] })
          }
        },
        i18n.t("referral.success", {
          record_type: startCase(RECORD_TYPES[recordType]),
          id: record.get("case_id_display")
        })
      )
    );
  };

  useEffect(() => {
    setDisabled(true);

    return () => dispatch(setServiceToRefer(fromJS({})));
  }, []);

  useEffect(() => {
    if (submittedSuccessfully && formValues.remote) {
      pdfExporterRef.current.savePdf({ setPending, close: handleClose, values: formValues });
    }
  }, [submittedSuccessfully]);

  return (
    <>
      <Form
        formID={formID}
        submitAllFields
        submitAlways
        formSections={forms}
        onSubmit={handleSubmit}
        validations={validations(i18n)}
        formErrors={formErrors}
        initialValues={{
          [FIELDS.CONSENT_INDIVIDUAL_TRANSFER]: providedConsent,
          ...referralFromService
        }}
        renderBottom={formMethods => (
          <PdfExporter
            formMethods={formMethods}
            record={record}
            forms={recordTypesForms}
            ref={pdfExporterRef}
            formsSelectedFieldDefault=""
            formsSelectedField={FIELDS.ROLE}
            formsSelectedSelector={OPTION_TYPES.MANAGED_ROLE_FORM_SECTIONS}
            customFilenameField={CUSTOM_EXPORT_FILE_NAME_FIELD}
            customFormProps={customReferralFormProps(i18n)}
          />
        )}
      />
    </>
  );
};

Referrals.displayName = "Referrals";

Referrals.propTypes = {
  canConsentOverride: PropTypes.bool,
  formID: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  providedConsent: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  setDisabled: PropTypes.func.isRequired,
  setPending: PropTypes.func.isRequired
};

export default Referrals;
