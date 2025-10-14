// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import { fetchRecord, getSelectedRecordData } from "../../records";
import { whichFormMode } from "../../form";
import { RECORD_TYPES, RECORD_TYPES_PLURAL, ROUTES } from "../../../config";
import { useMemoizedSelector } from "../../../libs";
import useRecordForms from "../../record-form/form/use-record-forms";
import { RecordForm } from "../../record-form/components/record-form";
import { getShouldFetchRecord } from "../../record-form/selectors";
import { useApp } from "../../application";
import { getCurrentUserModules } from "../../user";

function Component({ mode }) {
  const { demo } = useApp();
  const dispatch = useDispatch();
  const containerMode = whichFormMode(mode);
  const recordType = RECORD_TYPES_PLURAL.case;
  const isEditOrShow = containerMode.isEdit || containerMode.isShow;
  const record = useMemoizedSelector(state => getSelectedRecordData(state, recordType));
  const userModules = useMemoizedSelector(state => getCurrentUserModules(state));
  // NOTE: For now, we use the first module of the current user.
  const primeroModule = userModules.first();
  const forms = useRecordForms({ isEditOrShow, primeroModule, recordType, record });
  const shouldFetchRecord = useMemoizedSelector(state =>
    getShouldFetchRecord(state, { id: record?.get("id"), recordType })
  );
  const isNotANewCase = !containerMode.isNew;
  const isCaseIdEqualParam = !containerMode.isNew;
  const approvalSubforms = record?.get("approval_subforms");
  const incidentsSubforms = record?.get("incident_details");

  useEffect(() => {
    if (shouldFetchRecord) {
      // TODO: Redirect to /new if a record does not exist.
      // TODO: Redirect to /show if a record already exists
      dispatch(fetchRecord(RECORD_TYPES_PLURAL.case, "identified"));
    }
  }, []);

  useEffect(() => {
    if (record?.get("id") && containerMode.isNew) {
      dispatch(push(ROUTES.my_case));
    }
  }, [record?.get("id"), containerMode.isNew]);

  return (
    <RecordForm
      params={{ recordType, id: record?.get("id"), module: primeroModule }}
      shouldFetchRecord={shouldFetchRecord}
      forms={forms.forms}
      summaryForm={forms.summaryForm}
      recordAttachments={forms.recordAttachments}
      firstTab={forms.firstTab}
      attachmentForms={forms.attachmentForms}
      formNav={forms.formNav}
      userPermittedFormsIds={forms.permittedFormsIds}
      canViewCases={false}
      canViewSummaryForm={false}
      demo={demo}
      canRefer={false}
      canSeeAccessLog={false}
      canSeeChangeLog={false}
      containerMode={containerMode}
      mode={mode}
      record={record}
      recordType={RECORD_TYPES.cases}
      isNotANewCase={isNotANewCase}
      isCaseIdEqualParam={isCaseIdEqualParam}
      approvalSubforms={approvalSubforms}
      incidentsSubforms={incidentsSubforms}
      isMyCase
    />
  );
}

Component.displayName = "MyCase";

Component.propTypes = {
  mode: PropTypes.string
};

export default Component;
