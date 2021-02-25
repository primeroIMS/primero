import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import isEqual from "lodash/isEqual";

import { getShortIdFromUniqueId } from "../../../../../../records/utils";
import { MODES, RECORD_PATH } from "../../../../../../../config";
import { LINK_FIELD, whichFormMode } from "../../../../../../form";
import FormSection from "../../../../../../form/components/form-section";
import TraceActions from "../trace-actions";
import { FORMS } from "../../constants";
import { unMatchCaseForTrace } from "../../../../../../records";
import { useI18n } from "../../../../../../i18n";

import { NAME } from "./constants";

const Component = ({ setSelectedForm, traceValues, formSection, recordType, selectedForm, handleClose, mode }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const formMode = whichFormMode(MODES.show);
  // eslint-disable-next-line camelcase
  const caseId = traceValues?.matched_case_id;
  const values = caseId ? { ...traceValues, matched_case_id: getShortIdFromUniqueId(caseId) } : traceValues;
  const methods = useForm({ defaultValues: values || {} });
  const hasMatch = Boolean(traceValues.matched_case_id);

  const index = formSection.fields.findIndex(field => field.name === "matched_case_id");
  const formSectionToRender = formSection
    .setIn(["fields", index, "type"], LINK_FIELD)
    .setIn(["fields", index, "href"], `/${RECORD_PATH.cases}/${caseId}`);

  useEffect(() => {
    const currentValues = methods.getValues();

    if (!isEqual(currentValues, values)) {
      methods.reset(values);
    }
  }, [traceValues]);

  const handleConfirm = () =>
    hasMatch
      ? dispatch(
          unMatchCaseForTrace({
            traceId: traceValues.id,
            recordType,
            message: i18n.t("tracing_request.messages.unmatch_action", {
              trace_id: getShortIdFromUniqueId(traceValues.id),
              record_id: getShortIdFromUniqueId(caseId)
            })
          })
        )
      : setSelectedForm(FORMS.matches);

  return (
    <>
      <TraceActions
        handleBack={handleClose}
        handleConfirm={handleConfirm}
        selectedForm={selectedForm}
        hasMatch={hasMatch}
        recordType={recordType}
        mode={mode}
      />
      <FormSection
        formSection={formSectionToRender}
        showTitle={false}
        disableUnderline
        formMode={formMode}
        formMethods={methods}
      />
    </>
  );
};

Component.propTypes = {
  formSection: PropTypes.object.isRequired,
  handleClose: PropTypes.func,
  mode: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedForm: PropTypes.string,
  setSelectedForm: PropTypes.func,
  traceValues: PropTypes.object
};

Component.displayName = NAME;

export default Component;
