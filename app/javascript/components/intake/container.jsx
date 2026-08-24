import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchForms, fetchOptions } from "../record-form";
import { useApp } from "../application";
import { RecordForm } from "../record-form/components/record-form";
import { RECORD_TYPES, RECORD_TYPES_PLURAL } from "../../config";
import useRecordForms from "../record-form/form/use-record-forms";
import { useMemoizedSelector } from "../../libs";
import { getRegistrationStream, getRegistrationStreamsTitle } from "../application/selectors";
import { useI18n } from "../i18n";
import { whichFormMode } from "../form";

function Container() {
  const params = useParams();
  const { demo } = useApp();
  const dispatch = useDispatch();
  const i18n = useI18n();

  const mode = "new";
  // TODO: Should recordType and primeroModule be hard-coded?
  const recordType = RECORD_TYPES.cases;
  const primeroModule = "primeromodule-cp";

  const { forms, formNav, recordAttachments, permittedFormsIds, firstTab, attachmentForms } = useRecordForms({
    isEditOrShow: false,
    primeroModule,
    recordType: RECORD_TYPES_PLURAL.case,
    checkPermittedForms: false,
    checkWritable: false
  });

  const intakeConfig = useMemoizedSelector(state => getRegistrationStream(state, params.id));
  const intakeStreamTitle = useMemoizedSelector(state => getRegistrationStreamsTitle(state));

  useEffect(() => {
    if (intakeConfig && intakeConfig.get("id")) {
      const id = intakeConfig.get("id");

      dispatch(fetchForms(`intakes/${id}/forms`));
      dispatch(fetchOptions(`intakes/${id}/lookups`));
    }
  }, [intakeConfig]);

  return (
    <RecordForm
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
