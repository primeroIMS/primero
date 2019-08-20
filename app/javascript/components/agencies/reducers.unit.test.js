import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";
import * as r from "./reducers";
import * as Record from "./records";

chai.use(chaiImmutable);

describe("Agencies - Reducers", () => {
  const defaultState = Map({
    data: []
  });

  it("should handle FETCH_AGENCY_LOGO_SUCCESS", () => {
    const expected = Map({
      data: Map({
        0: Record.AgencyRecord({
          unique_id: "agency-unicef",
          name: "UNICEF",
          logo: {
            small: "/rails/active_storage/blobs/jeff.png"
          }
        })
      })
    });
    const action = {
      type: "agencies/FETCH_AGENCY_LOGO_SUCCESS",
      payload: {
        data: {
          agencies: [
            {
              unique_id: "agency-unicef",
              name: "UNICEF",
              logo: {
                small: "/rails/active_storage/blobs/jeff.png"
              }
            }
          ]
        }
      }
    };
    const newState = r.reducers.agencies(defaultState, action);
    expect(newState.toJS()).to.eql(expected.toJS());
  });
});
