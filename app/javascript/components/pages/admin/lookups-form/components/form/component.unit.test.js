import { FormContext } from "react-hook-form";
import { fromJS } from "immutable";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import FormSectionField from "../../../../../form/components/form-section-field";
import { setupMountedComponent } from "../../../../../../test";
import SwitchInput from "../../../../../form/fields/switch-input";

import Form from "./component";

describe("<Form /> - components/form/component", () => {
  let component;
  const props = {
    formRef: { current: { submitForm: () => {} } },
    mode: "show",
    lookup: fromJS({ id: "test", values: [{ id: "test1", display_text: { en: "Test 1" } }] })
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(Form, props));
  });

  it("renders FormContext component", () => {
    expect(component.find(FormContext)).to.have.lengthOf(1);
  });

  it("renders FormSectionField component", () => {
    expect(component.find(FormSectionField)).to.have.lengthOf(1);
  });

  it("renders DragDropContext component", () => {
    expect(component.find(DragDropContext)).to.have.lengthOf(1);
  });

  it("renders Droppable component", () => {
    expect(component.find(Droppable)).to.have.lengthOf(1);
  });

  it("renders SwitchInput component", () => {
    expect(component.find(SwitchInput)).to.have.lengthOf(1);
  });
});
