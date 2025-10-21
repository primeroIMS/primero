// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import { fetchIdentifiedRecord, getIsIdentifiedRecordNotFound, getSelectedRecordOrNull } from "../../records";
import { whichFormMode } from "../../form";
import { RECORD_TYPES, RECORD_TYPES_PLURAL, ROUTES } from "../../../config";
import { useMemoizedSelector } from "../../../libs";
import useRecordForms from "../../record-form/form/use-record-forms";
import { RecordForm } from "../../record-form/components/record-form";
import { useApp } from "../../application";
import { getCurrentUserModules } from "../../user";

function Component({ mode }) {
  const { demo } = useApp();
  const dispatch = useDispatch();
  const containerMode = whichFormMode(mode);
  const recordType = RECORD_TYPES_PLURAL.case;
  const isEditOrShow = containerMode.isEdit || containerMode.isShow;
  const record = useMemoizedSelector(state => getSelectedRecordOrNull(state, recordType));
  const isRecordNotFound = useMemoizedSelector(state => getIsIdentifiedRecordNotFound(state, recordType));
  const userModules = useMemoizedSelector(state => getCurrentUserModules(state));
  // NOTE: For now, we use the first module of the current user.
  const primeroModule = userModules.first();
  const { forms, formNav, summaryForm, recordAttachments, attachmentForms, permittedFormsIds, firstTab } =
    useRecordForms({
      isEditOrShow,
      primeroModule,
      recordType,
      record
    });
  const isNotANewCase = !containerMode.isNew;
  const isCaseIdEqualParam = !containerMode.isNew;
  const renderRecordForm = containerMode.isNew || record?.get("id");

  useEffect(() => {
    if (!containerMode.isNew && isRecordNotFound) {
      dispatch(push(`${ROUTES.my_case}/new`));
    } else if (containerMode.isNew && record?.get("id")) {
      dispatch(push(ROUTES.my_case));
    }
  }, [record?.get("id"), isRecordNotFound, containerMode.isNew]);

  useEffect(() => {
    if (!isRecordNotFound) {
      dispatch(
        fetchIdentifiedRecord({ recordType: RECORD_TYPES_PLURAL.case, redirectOnNotFound: !containerMode.isNew })
      );
    }
  }, [isRecordNotFound, containerMode.isNew]);

  return (
    renderRecordForm && (
      <RecordForm
        params={{ recordType, id: record?.get("id"), module: primeroModule }}
        shouldFetchRecord={false}
        forms={forms}
        summaryForm={summaryForm}
        recordAttachments={recordAttachments}
        firstTab={firstTab}
        attachmentForms={attachmentForms}
        formNav={formNav}
        userPermittedFormsIds={permittedFormsIds}
        demo={demo}
        containerMode={containerMode}
        mode={mode}
        record={record}
        recordType={RECORD_TYPES.cases}
        isNotANewCase={isNotANewCase}
        isCaseIdEqualParam={isCaseIdEqualParam}
        hideCancelButton={containerMode.isNew}
        editRedirect={`${ROUTES.my_case}/edit`}
        redirectTo={ROUTES.my_case}
      />
    )
  );
}

Component.displayName = "MyCase";

Component.propTypes = {
  mode: PropTypes.string
};

export default Component;
