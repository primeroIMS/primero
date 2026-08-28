import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchForms, fetchOptions } from "../record-form";
import { useApp } from "../application";
import { RecordForm } from "../record-form/components/record-form";
import { MODES, RECORD_TYPES_PLURAL } from "../../config";
import useRecordForms from "../record-form/form/use-record-forms";
import { useMemoizedSelector } from "../../libs";
import { getRegistrationStream, getRegistrationStreamsTitle } from "../application/selectors";
import { useI18n } from "../i18n";
import { whichFormMode } from "../form";

import { saveIntakeRecord } from "./action-creators";

function Container() {
  const params = useParams();
  const { demo } = useApp();
  const dispatch = useDispatch();
  const i18n = useI18n();

  const intakeConfig = useMemoizedSelector(state => getRegistrationStream(state, params.id));
  const intakeStreamTitle = useMemoizedSelector(state => getRegistrationStreamsTitle(state));

  const mode = MODES.new;
  const recordType = intakeConfig?.get("record_type");
  const primeroModule = intakeConfig?.get("module_id");
  const id = intakeConfig?.get("id");

  const { forms, formNav, recordAttachments, permittedFormsIds, firstTab, attachmentForms } = useRecordForms({
    isEditOrShow: false,
    primeroModule,
    recordType: RECORD_TYPES_PLURAL.case,
    checkPermittedForms: false,
    checkWritable: false
  });

  useEffect(() => {
    if (intakeConfig && intakeConfig.get("id")) {
      dispatch(fetchForms(`intakes/${id}/forms`));
      dispatch(fetchOptions(`intakes/${id}/lookups`));
    }
  }, [intakeConfig]);

  const handleSave = data => {
    dispatch(saveIntakeRecord(params.id, data));
  };

  return (
    <RecordForm
      submitActionOverride={handleSave}
      showFormToolbar
      hideCancelButton
      params={params}
      forms={forms}
      forcePermitFormReadWrite
      title={intakeStreamTitle.getIn([i18n.locale, params.id], "")}
      shouldFetchRecord={false}
      recordAttachments={recordAttachments}
      firstTab={firstTab}
      attachmentForms={attachmentForms}
      formNav={formNav}
      userPermittedFormsIds={permittedFormsIds}
      demo={demo}
      containerMode={whichFormMode(mode)}
      mode={mode}
      recordType={recordType}
      primeroModule={primeroModule}
    />
  );
}

Container.displayName = "Intake";

export default Container;
