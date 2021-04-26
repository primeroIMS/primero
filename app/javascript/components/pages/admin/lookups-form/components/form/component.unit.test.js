import { fromJS } from "immutable";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import FormSectionField from "../../../../../form/components/form-section-field";
import { setupMountedComponent, lookups } from "../../../../../../test";
import SwitchInput from "../../../../../form/fields/switch-input";
import { LOCALE_KEYS } from "../../../../../../config";

import Form from "./component";

describe("<Form /> - components/form/component", () => {
  let component;
  const props = {
    formRef: { current: { submitForm: () => {} } },
    mode: "show",
    lookup: fromJS(lookups().data[0])
  };
  const initialState = fromJS({
    application: {
      primero: {
        locales: [LOCALE_KEYS.en, "ar"]
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(Form, props, initialState));
  });

  it("renders FormSectionField component", () => {
    expect(component.find(FormSectionField)).to.have.lengthOf(5);
  });

  it("first value of the FormSectionField should be english", () => {
    const valuesFirstFormSectionFields = component.find(FormSectionField).first().props().field.option_strings_text[0];

    expect(valuesFirstFormSectionFields.id).to.equal(LOCALE_KEYS.en);
  });

  it("renders DragDropContext component", () => {
    expect(component.find(DragDropContext)).to.have.lengthOf(1);
  });

  it("renders Droppable component", () => {
    expect(component.find(Droppable)).to.have.lengthOf(1);
  });

  it("renders SwitchInput component", () => {
    expect(component.find(SwitchInput)).to.have.lengthOf(2);
  });
});
