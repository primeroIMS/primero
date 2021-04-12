import { get } from "../../components/form/utils";
import { getFieldMap, offlineIncidentFromCase } from "../../components/records";
import { ID_FIELD, INCIDENT_CASE_ID_DISPLAY_FIELD, MODULE_TYPE_FIELD } from "../../config";
import { buildFieldMap } from "../../libs";

export default (store, data = {}) => {
  const moduleID = get(data, MODULE_TYPE_FIELD);
  const fieldMap = getFieldMap(store.getState(), moduleID);

  store.dispatch(
    offlineIncidentFromCase({
      moduleID,
      caseID: get(data, ID_FIELD),
      caseDisplayID: get(data, INCIDENT_CASE_ID_DISPLAY_FIELD),
      data: buildFieldMap(data, fieldMap)
    })
  );
};
