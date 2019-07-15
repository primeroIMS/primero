import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";
import * as r from "./reducer";

chai.use(chaiImmutable);

describe("<RecordList /> - Reducers", () => {
  it("should handle FETCH_DATA", () => {
    const expected = {
        name: "Simon Nehme",
        organization: "UNICEF",
        position: "Child Protection Officer - CPIMS Administrator",
        phone: "+961 70 673 187",
        email: "snehme@unicef.org",
        location: "United Nations Children’s Fund Lebanon",
        support_forum: "https://google.com",
        other_information: "",
        primero_version: "1.3.15"
    };
    const action = {
      type: "Support/FETCH_DATA",
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
          primero_version: "1.3.15"
        }
      }
    };
    const newState = r.reducers.Support(Map({}), action);

    expect(newState.get("data").toJS()).to.deep.equal(expected);
  });

});
