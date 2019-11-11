
import { expect } from "chai";
import { setupMountedComponent } from "../../../test";
import { fromJS, Map } from "immutable";
import Support from "./container";
import * as R from "./records";

describe("<Support />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      Support,
      {},
      Map({
        records: Map({
          Support: {
            data: R.ContactInformationRecord({
              name: "Simon Nehme",
              organization: "UNICEF",
              position: "Child Protection Officer - CPIMS Administrator",
              phone: "+961 70 673 187",
              email: "snehme@unicef.org",
              location: "United Nations Children’s Fund Lebanon",
              support_forum: "https://google.com",
              other_information: "",
              primeroVersion: "1.3.15"
            })
          }
        })
      })
    ).component;
  });

  it("renders the Support", () => {
    expect(component.find(Support)).to.have.length(1);
  });
});
