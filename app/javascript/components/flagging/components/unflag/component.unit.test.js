import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import Form, { FormSection, FormSectionField } from "../../../form";
import ActionButton from "../../../action-button";

import Unflag from "./component";
import { UNFLAG_DIALOG } from "./constants";

describe("<Unflag />", () => {
  let component;

  const props = {
    flag: {
      id: 7,
      record_id: "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0",
      record_type: "cases",
      date: "2019-08-01",
      message: "This is a flag 1",
      flagged_by: "primero",
      removed: false
    }
  };

  const initialState = fromJS({
    ui: { dialogs: { dialog: UNFLAG_DIALOG, open: true } }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(Unflag, props, initialState));
  });

  it("should render the Unflag", () => {
    expect(component.find(Unflag)).to.have.lengthOf(1);
  });

  it("renders Form", () => {
    expect(component.find(Form)).to.have.lengthOf(1);
  });

  it("renders FormSectionRecord", () => {
    expect(component.find(FormSection)).to.have.lengthOf(1);
  });

  it("renders FieldRecord", () => {
    expect(component.find(FormSectionField)).to.have.lengthOf(1);
  });

  it("renders ActionButton", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(2);
  });

  it("renders component with valid props", () => {
    const flagFormProps = { ...component.find(Unflag).props() };

    ["flag"].forEach(property => {
      expect(flagFormProps).to.have.property(property);
      delete flagFormProps[property];
    });
    expect(flagFormProps).to.be.empty;
  });
});
