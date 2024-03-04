// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useMemo } from "react";

import { RECORD_TYPES, INCIDENT_CASE_ID_DISPLAY_FIELD, INCIDENT_CASE_ID_FIELD } from "../../config";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import { getIncidentFromCase } from "../records";

function useIncidentFromCase({ recordType, record }) {
  const incidentFromCase = useMemoizedSelector(state => getIncidentFromCase(state, recordType));
  const getFieldFromIncidentCase = field => {
    if (recordType === RECORD_TYPES.incidents) {
      return incidentFromCase?.size ? incidentFromCase.get(field) : record?.get(field);
    }

    return null;
  };

  const incidentFromCaseIdDisplay = useMemo(
    () => getFieldFromIncidentCase(INCIDENT_CASE_ID_DISPLAY_FIELD),
    [recordType, record]
  );
  const incidentFromCaseId = useMemo(() => getFieldFromIncidentCase(INCIDENT_CASE_ID_FIELD), [recordType, record]);

  return {
    incidentFromCaseIdDisplay,
    incidentFromCaseId,
    present: Boolean(incidentFromCaseIdDisplay) || Boolean(incidentFromCaseId)
  };
}

export default useIncidentFromCase;
