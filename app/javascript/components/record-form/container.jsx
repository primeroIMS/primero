// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import useMemoizedSelector from "../../libs/use-memoized-selector";
import { getIncidentFromCase, selectRecord, getCaseIdForIncident, fetchRecord } from "../records";
import { RECORD_PATH, RECORD_TYPES, SUMMARY, RECORD_TYPES_PLURAL } from "../../config";
import {
  usePermissions,
  SHOW_FIND_MATCH,
  READ_RECORDS,
  REFER_FROM_SERVICE,
  SHOW_ACCESS_LOG,
  SHOW_CHANGE_LOG,
  RESOURCES
} from "../permissions";
import { getRecordAttachments, getLoadingRecordState } from "../records/selectors";
import { READ_FAMILY_RECORD, READ_REGISTRY_RECORD, VIEW_INCIDENTS_FROM_CASE } from "../permissions/constants";
import { useApp } from "../application";

import {
  getAttachmentForms,
  getFirstTab,
  getFormNav,
  getPermittedForms,
  getRecordForms,
  getRecordFormsByUniqueId,
  getShouldFetchRecord
} from "./selectors";
import { NAME } from "./constants";
import { RecordForm } from "./components/record-form";

let caseRegistryLoaded = false;

function Container({ mode }) {
  const params = useParams();
  const { demo } = useApp();
  const dispatch = useDispatch();
  const recordType = RECORD_TYPES[params.recordType];

  const containerMode = {
    isNew: mode === "new",
    isEdit: mode === "edit",
    isShow: mode === "show"
  };

  const isEditOrShow = containerMode.isEdit || containerMode.isShow;

  const canViewCases = usePermissions(params.recordType, READ_RECORDS);
  const canViewSummaryForm = usePermissions(RESOURCES.potential_matches, SHOW_FIND_MATCH);
  const canViewRegistryRecord = usePermissions(RESOURCES.cases, READ_REGISTRY_RECORD);
  const canViewFamilyRecord = usePermissions(RESOURCES.cases, READ_FAMILY_RECORD);
  const canViewIncidentRecord = usePermissions(RESOURCES.cases, VIEW_INCIDENTS_FROM_CASE);
  const canRefer = usePermissions(params.recordType, REFER_FROM_SERVICE);
  const canSeeChangeLog = usePermissions(params.recordType, SHOW_CHANGE_LOG);
  const canSeeAccessLog = usePermissions(params.recordType, SHOW_ACCESS_LOG);

  const incidentFromCase = useMemoizedSelector(state => getIncidentFromCase(state, recordType));
  const fetchFromCaseId = useMemoizedSelector(state => getCaseIdForIncident(state, recordType));
  const record = useMemoizedSelector(state =>
    selectRecord(state, { isEditOrShow, recordType: params.recordType, id: params.id })
  );
  const loading = useMemoizedSelector(state => getLoadingRecordState(state, params.recordType));

  const selectedModule = {
    recordType,
    primeroModule: record ? record.get("module_id") : params.module,
    checkPermittedForms: true,
    renderCustomForms:
      canViewSummaryForm ||
      canViewRegistryRecord ||
      canViewFamilyRecord ||
      canViewIncidentRecord ||
      canSeeChangeLog ||
      canSeeAccessLog,
    checkWritable: true,
    recordId: record?.get("id"),
    isEditOrShow
  };

  const permittedFormsIds = useMemoizedSelector(state => getPermittedForms(state, selectedModule));
  const formNav = useMemoizedSelector(state => getFormNav(state, selectedModule));
  const forms = useMemoizedSelector(state => getRecordForms(state, selectedModule));
  const attachmentForms = useMemoizedSelector(state => getAttachmentForms(state));
  const firstTab = useMemoizedSelector(state => getFirstTab(state, selectedModule));
  const recordAttachments = useMemoizedSelector(state => getRecordAttachments(state, params.recordType));
  const summaryForm = useMemoizedSelector(state =>
    getRecordFormsByUniqueId(state, { ...selectedModule, formName: SUMMARY, getFirst: true })
  );
  const shouldFetchRecord = useMemoizedSelector(state => getShouldFetchRecord(state, params));

  const isNotANewCase = !containerMode.isNew && params.recordType === RECORD_PATH.cases;
  const isCaseIdEqualParam = params?.id === record?.get("id");
  const approvalSubforms = record?.get("approval_subforms");
  const incidentsSubforms = record?.get("incident_details");
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
      canViewCases={canViewCases}
      canViewSummaryForm={canViewSummaryForm}
      formNav={formNav}
      fetchFromCaseId={fetchFromCaseId}
      userPermittedFormsIds={permittedFormsIds}
      demo={demo}
      canRefer={canRefer}
      canSeeAccessLog={canSeeAccessLog}
      canSeeChangeLog={canSeeChangeLog}
      containerMode={containerMode}
      mode={mode}
      record={record}
      recordType={recordType}
      isNotANewCase={isNotANewCase}
      isCaseIdEqualParam={isCaseIdEqualParam}
      approvalSubforms={approvalSubforms}
      incidentsSubforms={incidentsSubforms}
    />
  );
}

Container.displayName = NAME;

Container.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Container;
