import { fromJS, Map, List } from "immutable";

import { mergeRecord } from "../../libs";

import {
  RECORDS_STARTED,
  RECORD_STARTED,
  RECORDS_FAILURE,
  RECORDS_SUCCESS,
  RECORDS_FINISHED,
  RECORD,
  SAVE_RECORD_STARTED,
  SAVE_RECORD_FINISHED,
  SAVE_RECORD_FAILURE,
  SAVE_RECORD_SUCCESS,
  RECORD_SUCCESS,
  RECORD_FAILURE,
  RECORD_FINISHED,
  SERVICE_REFERRED_SAVE,
  FETCH_RECORD_ALERTS_SUCCESS
} from "./actions";

const DEFAULT_STATE = Map({ data: List([]) });

export default namespace => (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case `${namespace}/${RECORDS_STARTED}`:
    case `${namespace}/${RECORD_STARTED}`:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case `${namespace}/${RECORDS_FAILURE}`:
      return state.set("errors", true);
    case `${namespace}/${RECORDS_SUCCESS}`: {
      const { data, metadata } = payload;

      return state
        .update("data", u => {
          return fromJS(
            data.map(d => {
              const index = u.findIndex(r => r.get("id") === d.id);

              if (index !== -1) {
                return mergeRecord(u.get(index), fromJS(d));
              }

              return d;
            })
          );
        })
        .set("metadata", fromJS(metadata));
    }
    case `${namespace}/${RECORDS_FINISHED}`:
      return state.set("loading", false);
    case `${namespace}/${RECORD}`:
      return state.set("loading", true);
    case `${namespace}/${SAVE_RECORD_STARTED}`:
      return state.set("saving", true);
    case `${namespace}/${SAVE_RECORD_FINISHED}`:
    case `${namespace}/${SAVE_RECORD_FAILURE}`:
      return state.set("saving", false);
    case `${namespace}/${SAVE_RECORD_SUCCESS}`:
    case `${namespace}/${RECORD_SUCCESS}`: {
      const { data } = payload;
      const index = state.get("data").findIndex(r => r.get("id") === data.id);

      if (index !== -1) {
        const {
          incident_details: incidents,
          services_section: services
        } = data;

        const stateWithAlertCount = {
          ...data,
          alert_count: incidents?.length || 0 + services?.length || 0
        };

        return state
          .updateIn(["data", index], u =>
            mergeRecord(
              u,
              fromJS(
                incidents?.length || services?.length
                  ? stateWithAlertCount
                  : data
              )
            )
          )
          .set("errors", false);
      }

      return state
        .update("data", u => {
          return u.push(fromJS(data));
        })
        .set("errors", false);
    }
    case `${namespace}/${RECORD_FAILURE}`:
      return state.set("errors", true);
    case `${namespace}/${RECORD_FINISHED}`:
      return state.set("loading", false);
    case `${namespace}/${FETCH_RECORD_ALERTS_SUCCESS}`:
      return state.set("recordAlerts", fromJS(payload.data));
    case "user/LOGOUT_SUCCESS":
      return DEFAULT_STATE;
    case `${namespace}/${SERVICE_REFERRED_SAVE}`: {
      const serviceRecordId = payload.json.data.service_record_id;
      const {
        id: recordId,
        services_section: servicesSection
      } = payload.json.data.record;

      const referredService = fromJS(servicesSection || []).find(
        service => service.get("unique_id") === serviceRecordId
      );

      if (referredService?.size) {
        const recordIndex = state
          .get("data")
          .findIndex(record => record.get("id") === recordId);

        const serviceIndex = state
          .getIn(["data", recordIndex, "services_section"])
          ?.findIndex(
            service =>
              service.get("unique_id") === referredService.get("unique_id")
          );

        return state.updateIn(
          ["data", recordIndex, "services_section", serviceIndex],
          data => data?.merge(referredService)
        );
      }

      return state;
    }
    default:
      return state;
  }
};
