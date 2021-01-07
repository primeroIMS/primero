import { fromJS } from "immutable";

import { setupMountedComponent } from "../../test";
import { PageHeading } from "../page";
import Form, { FormAction } from "../form";
import TextInput from "../form/fields/text-input";

import PasswordReset from "./component";

describe("<PasswordReset />", () => {
  let component;

  const initialState = fromJS({});

  beforeEach(() => {
    ({ component } = setupMountedComponent(PasswordReset, {}, initialState));
  });

  it("should render a <PageHeading /> component", () => {
    expect(component.find(PageHeading)).to.have.lengthOf(1);
  });

  it("should render a <Form /> component", () => {
    expect(component.find(Form)).to.have.lengthOf(1);
  });

  it("should render a <FormAction /> component", () => {
    expect(component.find(FormAction)).to.have.lengthOf(1);
  });

  it("should render 2 <TextInput /> components", () => {
    expect(component.find(TextInput)).to.have.lengthOf(2);
  });
});
