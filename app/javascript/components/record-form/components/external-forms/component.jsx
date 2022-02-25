import Transitions from "../../../transitions";
import {
  APPROVALS,
  RECORD_OWNER,
  TRANSITION_TYPE,
  INCIDENT_FROM_CASE,
  CHANGE_LOGS,
  SUMMARY,
  RECORD_TYPES_PLURAL,
  REGISTRY_FROM_CASE
} from "../../../../config";
import RecordOwner from "../../../record-owner";
import Approvals from "../../../approvals";
import IncidentFromCase from "../../../incidents-from-case";
import ChangeLogs from "../../../change-logs";
import Summary from "../../../summary";
import CaseRegistry from "../../form/components/case-registry";

const externalForms = ({
  approvalSubforms,
  canSeeChangeLog,
  containerMode,
  handleCreateIncident,
  handleToggleNav,
  id,
  incidentsSubforms,
  mobileDisplay,
  primeroModule,
  record,
  recordType,
  selectedForm,
  summaryForm,
  transitionProps
}) => (form, setFieldValue, handleSubmit, values, dirty) => {
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
      <Approvals approvals={approvalSubforms} mobileDisplapary={mobileDisplay} handleToggleNav={handleToggleNav} />
    ),
    [INCIDENT_FROM_CASE]: (
      <IncidentFromCase
        record={record}
        incidents={incidentsSubforms}
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
        primeroModule={primeroModule}
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
      />
    ),
    [REGISTRY_FROM_CASE]: (
      <CaseRegistry
        values={values}
        record={record}
        mode={containerMode}
        primeroModule={primeroModule}
        recordType={recordType}
        setFieldValue={setFieldValue}
      />
    )
  }[externalFormSelected];
};

export default externalForms;
