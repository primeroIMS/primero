import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Button } from "@material-ui/core";
import { Formik, Field, Form } from "formik";
import { SearchableSelect } from "components/searchable-select";
import users from "../mocked-users";
import ReassignForm from "./reassign-form";

describe("<ReassignForm />", () => {
  let component;
  const props = {
    users,
    handleClose: () => {}
  };
  beforeEach(() => {
    ({ component } = setupMountedComponent(ReassignForm, props));
  });

  it("renders Formik", () => {
    expect(component.find(Formik)).to.have.length(1);
  });

  it("renders Form", () => {
    expect(component.find(Form)).to.have.length(1);
  });

  it("renders SearchableSelect", () => {
    expect(component.find(SearchableSelect)).to.have.length(1);
  });

  it("renders Field", () => {
    expect(component.find(Field)).to.have.length(2);
  });

  it("renders Button", () => {
    expect(component.find(Button)).to.have.length(2);
  });
});
