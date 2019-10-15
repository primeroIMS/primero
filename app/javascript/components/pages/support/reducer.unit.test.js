import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";
import * as r from "./reducer";
import * as R from "./records";

chai.use(chaiImmutable);

describe("<RecordList /> - Reducers", () => {
  it("should handle FETCH_DATA_SUCCESS", () => {
    const expected = {
      name: "Simon Nehme",
      organization: "UNICEF",
      position: "Child Protection Officer - CPIMS Administrator",
      phone: "+961 70 673 187",
      email: "snehme@unicef.org",
      location: "United Nations Children’s Fund Lebanon",
      support_forum: "https://google.com",
      other_information: "",
      primeroVersion: "1.3.15"
    };
    const action = {
      type: "support/FETCH_DATA_SUCCESS",
      payload: {
        data: {
          name: "Simon Nehme",
          organization: "UNICEF",
          position: "Child Protection Officer - CPIMS Administrator",
          phone: "+961 70 673 187",
          email: "snehme@unicef.org",
          location: "United Nations Children’s Fund Lebanon",
          support_forum: "https://google.com",
          other_information: "",
          primeroVersion: "1.3.15"
        }
      }
    };
    const newState = r.reducers.support(Map({}), action);
    expect(newState.get("data")).to.deep.equal(
      R.ContactInformationRecord(expected)
    );
  });

  it("should handle FETCH_DATA_STARTED", () => {
    const action = {
      type: "support/FETCH_DATA_STARTED",
      payload: true
    };
    const newState = r.reducers.support(Map({}), action);

    expect(newState.get("loading")).to.deep.equal(true);
    expect(newState.get("errors")).to.deep.equal(false);
  });

  it("should handle FETCH_DATA_FINISHED", () => {
    const action = {
      type: "support/FETCH_DATA_FINISHED",
      payload: false
    };
    const newState = r.reducers.support(Map({}), action);

    expect(newState.get("loading")).to.deep.equal(false);
  });

  it("should handle FETCH_DATA_FAILURE", () => {
    const action = {
      type: "support/FETCH_DATA_FAILURE",
      payload: false
    };
    const newState = r.reducers.support(Map({}), action);

    expect(newState.get("errors")).to.deep.equal(true);
  });
});
