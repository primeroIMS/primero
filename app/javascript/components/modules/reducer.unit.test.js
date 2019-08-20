import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";
import * as r from "./reducers";
import * as Record from "./records";

chai.use(chaiImmutable);

describe("Modules - Reducers", () => {
  const defaultState = Map({
    data: []
  });

  it("should handle FETCH_MODULES_SUCCESS", () => {
    const expected = Map({
      data: Map({
        0: Record.ModulesRecord({
          unique_id: "primeromodule-cp",
          name: "CP"
        }),
        1: Record.ModulesRecord({
          unique_id: "primeromodule-gbv",
          name: "GBV"
        })
      })
    });
    const action = {
      type: "modules/FETCH_MODULES_SUCCESS",
      payload: {
        data: {
          modules: [
            {
              unique_id: "primeromodule-cp",
              name: "CP",
              associated_record_types: ["case", "tracing_request", "incident"],
              options: {
                allow_searchable_ids: true,
                use_workflow_case_plan: true,
                use_workflow_assessment: false,
                reporting_location_filter: true,
                use_workflow_service_implemented: true
              }
            },
            {
              unique_id: "primeromodule-gbv",
              name: "GBV",
              associated_record_types: ["case", "incident"],
              options: {
                user_group_filter: true
              }
            }
          ]
        }
      }
    };
    const newState = r.reducers.modules(defaultState, action);
    expect(newState.toJS()).to.eql(expected.toJS());
  });
});
