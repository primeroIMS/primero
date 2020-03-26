import { fromJS, Map, List } from "immutable";

import { mergeRecord, rejectKeys } from "../../libs";
import TransitionActions from "../record-actions/transitions/actions";

import * as Actions from "./actions";

const DEFAULT_STATE = Map({ data: List([]) });

export const reducers = namespace => (
  state = DEFAULT_STATE,
  { type, payload }
) => {
  switch (type) {
    case `${namespace}/${Actions.RECORDS_STARTED}`:
    case `${namespace}/${Actions.RECORD_STARTED}`:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case `${namespace}/${Actions.RECORDS_FAILURE}`:
      return state.set("errors", true);
    case `${namespace}/${Actions.RECORDS_SUCCESS}`: {
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
    case `${namespace}/${Actions.RECORDS_FINISHED}`:
      return state.set("loading", fromJS(payload));
    case `${namespace}/${Actions.RECORD}`:
      return state.set("loading", true);
    case `${namespace}/${Actions.SAVE_RECORD_STARTED}`:
      return state.set("saving", true);
    case `${namespace}/${Actions.SAVE_RECORD_FINISHED}`:
    case `${namespace}/${Actions.SAVE_RECORD_FAILURE}`:
      return state.set("saving", false);
    case `${namespace}/${Actions.SAVE_RECORD_SUCCESS}`:
    case `${namespace}/${Actions.RECORD_SUCCESS}`: {
      const { data } = payload;
      const index = state.get("data").findIndex(r => r.get("id") === data.id);

      if (index !== -1) {
        return state
          .updateIn(["data", index], u => mergeRecord(u, fromJS(data)))
          .set("errors", false);
      }

      return state
        .update("data", u => {
          return u.push(fromJS(data));
        })
        .set("errors", false);
    }
    case `${namespace}/${Actions.RECORD_FAILURE}`:
      return state.set("errors", true);
    case `${namespace}/${Actions.RECORD_FINISHED}`:
      return state.set("loading", false);
    case "user/LOGOUT_SUCCESS":
      return DEFAULT_STATE;
    case `${namespace}/${TransitionActions.SERVICE_REFERRED_SAVE}`: {
      const {
        id: recordId,
        services_section: servicesSection
      } = payload.json.data.record;

      const referredService = fromJS(servicesSection ? servicesSection[0] : []);
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
    default:
      return state;
  }
};
