/* eslint-disable prefer-destructuring */
import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Button } from "@material-ui/core";
import { Formik, Field, Form } from "formik";
import { CustomAutoComplete } from "components/searchable-select";
import ReassignForm from "./ReassignForm";

describe("<ReassignForm />", () => {
  const users = [
    { label: "primero" },
    { label: "primero_admin_cp" },
    { label: "primero_cp" },
    { label: "primero_mgr_cp" },
    { label: "primero_gbv" },
    { label: "primero_mgr_gbv" },
    { label: "primero_ftr_manager" },
    { label: "primero_user_mgr_cp" },
    { label: "primero_user_mgr_gbv" },
    { label: "agency_user_admin" }
  ].map(suggestion => ({
    value: suggestion.label.toLowerCase(),
    label: suggestion.label
  }));
  let component;
  const props = {
    users,
    handleClose: () => {}
  };
  before(() => {
    component = setupMountedComponent(ReassignForm, props).component;
  });

  it("renders Formik", () => {
    expect(component.find(Formik)).to.have.length(1);
  });

  it("renders Form", () => {
    expect(component.find(Form)).to.have.length(1);
  });

  it("renders CustomAutoComplete", () => {
    expect(component.find(CustomAutoComplete)).to.have.length(1);
  });

  it("renders Field", () => {
    expect(component.find(Field)).to.have.length(2);
  });

  it("renders Button", () => {
    expect(component.find(Button)).to.have.length(2);
  });
});
