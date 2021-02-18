import { fromJS } from "immutable";

import { OPTION_TYPES } from "../../../form";
import SelectInput from "../../../form/fields/select-input";
import { setupMountedComponent } from "../../../../test";

import Referrals from "./component";

describe("<RecordActions />/transitions/<Referrals />", () => {
  let component;

  const initialState = fromJS({
    forms: {
      options: {
        lookups: [
          {
            id: 1,
            unique_id: OPTION_TYPES.SERVICE_TYPE,
            name: { en: "Services" },
            values: [
              { id: "service_1", display_text: { en: "Service 1" } },
              { id: "service_2", display_text: { en: "Service 2" } }
            ]
          }
        ]
      }
    },
    application: {
      agencies: [
        { id: 1, unique_id: "agency_1", name: { en: "Agency 1" }, services: ["service_1"] },
        { id: 2, unique_id: "agency_2", name: { en: "Agency 2" }, services: ["service_2"] },
        { id: 3, unique_id: "agency_3", name: { en: "Agency 3" }, services: ["service_1"] }
      ]
    }
  });

  const initialProps = {
    formID: "referral-form",
    providedConsent: true,
    canConsentOverride: true,
    record: fromJS({ module_id: "module_1" }),
    recordType: "record_type_1",
    setDisabled: () => {},
    setPending: () => {},
    handleClose: () => {}
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(Referrals, initialProps, initialState));
  });

  it("should render all agencies if there is no selected service", () => {
    component.find(SelectInput).at(1).find("button").at(1).simulate("click");

    expect(component.find(SelectInput).find("ul.MuiAutocomplete-groupUl").find("li")).to.have.lengthOf(3);
    expect(
      component
        .find(SelectInput)
        .find("ul.MuiAutocomplete-groupUl")
        .find("li")
        .map(node => node.text())
    ).to.deep.equal(["Agency 1", "Agency 2", "Agency 3"]);
  });

  it("should render only those agencies with service_1", () => {
    component.find(SelectInput).at(0).find("button").at(1).simulate("click");
    component.find(SelectInput).at(0).find("ul.MuiAutocomplete-groupUl").at(0).find("li").at(0).simulate("click");
    component.find(SelectInput).at(1).find("button").at(1).simulate("click");

    expect(component.find(SelectInput).find("ul.MuiAutocomplete-groupUl").find("li")).to.have.lengthOf(2);
    expect(
      component
        .find(SelectInput)
        .find("ul.MuiAutocomplete-groupUl")
        .find("li")
        .map(node => node.text())
    ).to.deep.equal(["Agency 1", "Agency 3"]);
  });
});
