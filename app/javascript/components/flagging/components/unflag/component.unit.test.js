import { Formik, Field } from "formik";
import { Fab } from "@material-ui/core";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import { FormAction } from "../../../form";

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
    ui: { dialogs: { [`${UNFLAG_DIALOG}_${props.flag.id}`]: true } }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(Unflag, props, initialState));
  });

  it("should render the Unflag", () => {
    expect(component.find(Unflag)).to.have.lengthOf(1);
  });

  it("renders FormAction", () => {
    expect(component.find(FormAction)).to.have.lengthOf(1);
  });

  it("should render Formik", () => {
    expect(component.find(Formik)).to.have.lengthOf(1);
  });

  it("renders form", () => {
    expect(component.find("form")).to.have.lengthOf(1);
  });

  it("renders Field", () => {
    expect(component.find(Field)).to.have.lengthOf(1);
  });

  it("renders Form", () => {
    expect(component.find(Fab)).to.have.lengthOf(3);
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
