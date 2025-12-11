// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import useMemoizedSelector from "../../libs/use-memoized-selector";
import { getIncidentFromCase, selectRecord, getCaseIdForIncident, fetchRecord } from "../records";
import { RECORD_PATH, RECORD_TYPES, RECORD_TYPES_PLURAL } from "../../config";
import { getLoadingRecordState } from "../records/selectors";
import { useApp } from "../application";
import { whichFormMode } from "../form";

import { getShouldFetchRecord } from "./selectors";
import { NAME } from "./constants";
import { RecordForm } from "./components/record-form";
import useRecordForms from "./form/use-record-forms";

let caseRegistryLoaded = false;

function Container({ mode }) {
  const params = useParams();
  const { demo } = useApp();
  const dispatch = useDispatch();
  const recordType = RECORD_TYPES[params.recordType];
  const containerMode = whichFormMode(mode);
  const isEditOrShow = containerMode.isEdit || containerMode.isShow;

  const incidentFromCase = useMemoizedSelector(state => getIncidentFromCase(state, recordType));
  const fetchFromCaseId = useMemoizedSelector(state => getCaseIdForIncident(state, recordType));
  const record = useMemoizedSelector(state =>
    selectRecord(state, { isEditOrShow, recordType: params.recordType, id: params.id })
  );
  const loading = useMemoizedSelector(state => getLoadingRecordState(state, params.recordType));
  const { forms, formNav, summaryForm, recordAttachments, attachmentForms, permittedFormsIds, firstTab } =
    useRecordForms({
      isEditOrShow,
      primeroModule: record ? record.get("module_id") : params.module,
      recordType: params.recordType,
      record
    });

  const shouldFetchRecord = useMemoizedSelector(state => getShouldFetchRecord(state, params));

  const isNotANewCase = !containerMode.isNew && params.recordType === RECORD_PATH.cases;
  const isCaseIdEqualParam = params?.id === record?.get("id");
  const registryRecordID = record?.get("registry_record_id", false);

  useEffect(() => {
    if (registryRecordID && !loading && !caseRegistryLoaded && params.recordType === RECORD_PATH.cases) {
      dispatch(fetchRecord(RECORD_TYPES_PLURAL.registry_record, registryRecordID));
      caseRegistryLoaded = true;
    }
  }, [loading, registryRecordID]);

  useEffect(() => {
    return () => {
      caseRegistryLoaded = false;
    };
  }, []);

  return (
    <RecordForm
      params={params}
      forms={forms}
      incidentFromCase={incidentFromCase}
      shouldFetchRecord={shouldFetchRecord}
      summaryForm={summaryForm}
      recordAttachments={recordAttachments}
      firstTab={firstTab}
      attachmentForms={attachmentForms}
      formNav={formNav}
      fetchFromCaseId={fetchFromCaseId}
      userPermittedFormsIds={permittedFormsIds}
      demo={demo}
      containerMode={containerMode}
      mode={mode}
      record={record}
      recordType={recordType}
      isNotANewCase={isNotANewCase}
      isCaseIdEqualParam={isCaseIdEqualParam}
    />
  );
}

Container.displayName = NAME;

Container.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Container;
