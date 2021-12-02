import { fromJS } from "immutable";
import Chip from "@material-ui/core/Chip";

import { setupMountedComponent } from "../../../../../../../test";

import ViolationTitle from "./component";

describe("<RecordForm>/form/subforms/subform-fields/<ViolationTitle>", () => {
  it("should render violation title", () => {
    const props = {
      title: "This is a title",
      values: {
        unique_id: "ab123cde",
        relation_name: "this is a relation",
        verified: "verification_found_that_incident_did_not_occur"
      },
      fields: [{ name: "verified", option_strings_source: "lookup lookup-status" }]
    };

    const initialState = fromJS({
      forms: {
        options: {
          lookups: [
            {
              unique_id: "lookup-status",
              values: [
                { id: "status_1", display_text: { en: "status 1" } },
                { id: "status_2", display_text: { en: "status 2" } }
              ]
            }
          ]
        }
      }
    });
    const { component } = setupMountedComponent(ViolationTitle, props, initialState);

    expect(component.find(ViolationTitle)).to.have.lengthOf(1);
    expect(component.find(ViolationTitle).text()).to.equal("This is a title - b123cde ");
    expect(component.find(Chip)).to.have.lengthOf(1);
  });
});
