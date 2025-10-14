// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/display-name */
import Transitions from "../../../transitions";
import {
  ACCESS_LOGS,
  APPROVALS,
  FAMILY_FROM_CASE,
  RECORD_OWNER,
  TRANSITION_TYPE,
  INCIDENT_FROM_CASE,
  CHANGE_LOGS,
  SUMMARY,
  RECORD_TYPES_PLURAL,
  REGISTRY_FROM_CASE,
  SUMMARY_INCIDENT_MRM,
  CASE_RELATIONSHIPS
} from "../../../../config";
import RecordOwner from "../../../record-owner";
import Approvals from "../../../approvals";
import IncidentFromCase from "../../../incidents-from-case";
import ChangeLogs from "../../../change-logs";
import AccessLogs from "../../../access-logs";
import Summary from "../../../summary";
import CaseRegistry from "../../../case-registry";
import CaseFamily from "../../../case-family";
import SummaryIncidentMRM from "../../../summary-incident-mrm";
import CaseRelationships from "../../../case-relationships";

const externalForms =
  ({
    canSeeAccessLog,
    canSeeChangeLog,
    containerMode,
    handleCreateIncident,
    handleToggleNav,
    id,
    mobileDisplay,
    primeroModule,
    record,
    recordType,
    selectedForm,
    summaryForm,
    transitionProps,
    userPermittedFormsIds
  }) =>
  (form, setFieldValue, handleSubmit, values, dirty, formSections) => {
    const isTransitions = TRANSITION_TYPE.includes(form);

    const externalFormSelected = isTransitions ? TRANSITION_TYPE : form;

    return {
      [RECORD_OWNER]: (
        <RecordOwner
          record={record}
          recordType={recordType}
          mobileDisplay={mobileDisplay}
          handleToggleNav={handleToggleNav}
        />
      ),
      [APPROVALS]: (
        <Approvals
          primeroModule={primeroModule}
          approvals={record?.get("approval_subforms")}
          mobileDisplapary={mobileDisplay}
          handleToggleNav={handleToggleNav}
        />
      ),
      [INCIDENT_FROM_CASE]: (
        <IncidentFromCase
          record={record}
          incidents={record?.get("incident_details")}
          mobileDisplay={mobileDisplay}
          handleToggleNav={handleToggleNav}
          mode={containerMode}
          setFieldValue={setFieldValue}
          handleSubmit={handleSubmit}
          recordType={recordType}
          primeroModule={primeroModule}
          handleCreateIncident={handleCreateIncident}
          dirty={dirty}
        />
      ),
      [TRANSITION_TYPE]: <Transitions {...transitionProps} />,
      [CHANGE_LOGS]: (
        <ChangeLogs
          recordID={id}
          fetchable={canSeeChangeLog}
          recordType={RECORD_TYPES_PLURAL[recordType]}
          mobileDisplay={mobileDisplay}
          handleToggleNav={handleToggleNav}
          selectedForm={selectedForm}
        />
      ),
      [SUMMARY]: (
        <Summary
          record={record}
          recordType={recordType}
          mobileDisplay={mobileDisplay}
          handleToggleNav={handleToggleNav}
          form={summaryForm}
          mode={containerMode}
          values={values}
          userPermittedFormsIds={userPermittedFormsIds}
        />
      ),
      [REGISTRY_FROM_CASE]: (
        <CaseRegistry
          values={values}
          record={record}
          mode={containerMode}
          mobileDisplay={mobileDisplay}
          handleToggleNav={handleToggleNav}
          primeroModule={primeroModule}
          recordType={recordType}
          setFieldValue={setFieldValue}
        />
      ),
      [FAMILY_FROM_CASE]: (
        <CaseFamily
          values={values}
          record={record}
          mode={containerMode}
          mobileDisplay={mobileDisplay}
          handleToggleNav={handleToggleNav}
          primeroModule={primeroModule}
          recordType={recordType}
          setFieldValue={setFieldValue}
        />
      ),
      [CASE_RELATIONSHIPS]: (
        <CaseRelationships
          values={values}
          record={record}
          mode={containerMode}
          mobileDisplay={mobileDisplay}
          handleToggleNav={handleToggleNav}
          primeroModule={primeroModule}
          recordType={recordType}
          setFieldValue={setFieldValue}
        />
      ),
      [SUMMARY_INCIDENT_MRM]: (
        <SummaryIncidentMRM
          recordType={recordType}
          recordID={id}
          mobileDisplay={mobileDisplay}
          handleToggleNav={handleToggleNav}
          mode={containerMode}
          formSections={formSections}
          values={values}
        />
      ),
      [ACCESS_LOGS]: (
        <AccessLogs
          recordID={id}
          recordType={RECORD_TYPES_PLURAL[recordType]}
          mobileDisplay={mobileDisplay}
          handleToggleNav={handleToggleNav}
          selectedForm={selectedForm}
          fetchable={canSeeAccessLog}
        />
      )
    }[externalFormSelected];
  };

export default externalForms;
