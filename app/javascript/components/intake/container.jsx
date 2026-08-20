import { useParams } from "react-router-dom";
import { fromJS } from "immutable";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useApp } from "../application";
import { RecordForm } from "../record-form/components/record-form";
import { RECORD_TYPES } from "../../config";
import useRecordForms from "../record-form/form/use-record-forms";
import { fetchForms } from "../record-form";

function Container() {
  const params = useParams();
  const { demo } = useApp();
  const dispatch = useDispatch();
  const mode = "isNew";
  const recordType = RECORD_TYPES.cases;
  const primeroModule = "primeromodule-cp";

  const { forms, formNav, permittedFormsIds, firstTab } = useRecordForms({
    isEditOrShow: false,
    primeroModule,
    recordType
  });

  useEffect(() => {
    dispatch(fetchForms());
  }, []);

  console.log(forms, formNav, permittedFormsIds);

  return (
    <RecordForm
      params={params}
      forms={forms}
      // incidentFromCase={incidentFromCase}
      shouldFetchRecord={false}
      // summaryForm={summaryForm}
      recordAttachments={fromJS([])}
      firstTab={firstTab}
      // attachmentForms={attachmentForms}
      formNav={formNav}
      // fetchFromCaseId={fetchFromCaseId}
      userPermittedFormsIds={permittedFormsIds}
      demo={demo}
      containerMode={{ isNew: true }}
      mode={mode}
      // record={record}
      recordType={recordType}
      // isNotANewCase={isNotANewCase}
      // isCaseIdEqualParam={isCaseIdEqualParam}
    />
  );
}

Container.displayName = "Intake";

export default Container;
