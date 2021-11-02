import Form from "../../../form";
import { setupMountedComponent } from "../../../../test";
import { RECORD_TYPES } from "../../../../config/constants";

import FlagForm from "./component";

describe("<FlagForm />", () => {
  let component;

  const props = {
    recordType: RECORD_TYPES.cases,
    record: "230590",
    handleActiveTab: () => {}
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(FlagForm, props));
  });

  it("should render the FlagForm", () => {
    expect(component.find(FlagForm)).to.have.lengthOf(1);
  });

  it("renders Form", () => {
    expect(component.find(Form)).to.have.lengthOf(1);
  });

  it("renders component with valid props", () => {
    const flagFormProps = { ...component.find(FlagForm).props() };

    ["handleActiveTab", "record", "recordType"].forEach(property => {
      expect(flagFormProps).to.have.property(property);
      delete flagFormProps[property];
    });
    expect(flagFormProps).to.be.empty;
  });
});
