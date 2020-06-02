import { FormContext } from "react-hook-form";
import { fromJS } from "immutable";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import FormSectionField from "../../../../../form/components/form-section-field";
import { setupMountedComponent } from "../../../../../../test";

import Form from "./component";

describe("<Form /> - components/form/component", () => {
  let component;
  const props = {
    formRef: null,
    mode: "show",
    lookup: fromJS({})
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
});
