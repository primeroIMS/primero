/* eslint-disable no-unused-expressions */
import React from "react";
import * as keydown from "keyevent";
import { expect } from "chai";
import { setupMountedComponent } from "../../../../../test";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { SearchableSelect } from "../../../../searchable-select";
import FormInternal from "./form-internal";

const InternalForm = props => {
  const formProps = {
    initialValues: {
      agency: "",
      recipient: "",
      notes: ""
    }
  };
  return (
    <Formik {...formProps}>
      <Form>
        <FormInternal {...props} />
      </Form>
    </Formik>
  );
};

describe("<FormInternal />", () => {
  let component;
  const props = {
    disableControl: false,
    fields: [
      {
        id: "agency",
        label: "UNICEF",
        options: [{ value: "agency-unicef", label: "UNICEF" }]
      },
      {
        id: "recipient",
        label: "Recipient",
        options: [{ value: "primero", label: "Primero User" }]
      },
      {
        id: "notes",
        label: "Notes"
      }
    ]
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(InternalForm, props));
  });

  it("renders SearchableSelect", () => {
    expect(component.find(SearchableSelect)).to.have.length(2);
  });

  it("renders TextField", () => {
    expect(component.find(TextField)).to.have.length(1);
  });

  it("renders Field", () => {
    expect(component.find(Field)).to.have.length(3);
  });

  it("renders default label for SearchableSelect", () => {
    component
      .find("input")
      .first()
      .simulate("keyDown", {
        key: "ArrowDown",
        keyCode: keydown.DOM_VK_DOWN
      });

    expect(component.find("div.Mui-selected").text()).to.be.equal(
      "fields.select_single"
    );
  });

  it("renders TextFieldProps from SearchableSelect with valid props", () => {
    const textFieldProps = {
      ...component
        .find(SearchableSelect)
        .first()
        .props().TextFieldProps
    };

    [
      "label",
      "required",
      "error",
      "helperText",
      "margin",
      "placeholder",
      "InputLabelProps"
    ].forEach(property => {
      expect(textFieldProps).to.have.property(property);
      delete textFieldProps[property];
    });
    expect(textFieldProps).to.be.empty;
  });
});
