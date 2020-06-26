import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import { RECORD_TYPES } from "../../../../config/constants";

import ListFlags from "./component";

describe("<ListFlags />", () => {
  let component;

  const props = {
    recordType: RECORD_TYPES.cases,
    record: "230590",
    flags: fromJS([])
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(ListFlags, props));
  });

  it("should render the ListFlags", () => {
    expect(component.find(ListFlags)).to.have.lengthOf(1);
  });

  it("renders component with valid props", () => {
    const listFlagsProps = { ...component.find(ListFlags).props() };

    ["flags", "record", "recordType"].forEach(property => {
      expect(listFlagsProps).to.have.property(property);
      delete listFlagsProps[property];
    });
    expect(listFlagsProps).to.be.empty;
  });
});
