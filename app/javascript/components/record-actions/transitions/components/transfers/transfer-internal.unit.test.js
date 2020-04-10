import React from "react";
import { TextField } from "formik-material-ui";
import { Field, Form, Formik } from "formik";
import * as keydown from "keyevent";

import { setupMountedComponent } from "../../../../../test";
import SearchableSelect from "../../../../searchable-select";

import TransferInternal from "./transfer-internal";

const InternalForm = props => {
  const formProps = {
    initialValues: {
      agency: "",
      notes: ""
    },
    onSubmit: () => {}
  };

  return (
    <Formik {...formProps}>
      <Form>
        <TransferInternal {...props} />
      </Form>
    </Formik>
  );
};

describe("<TransferInternal />", () => {
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
        id: "notes",
        label: "Notes"
      }
    ]
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(InternalForm, props));
  });

  it("renders SearchableSelect", () => {
    expect(component.find(SearchableSelect)).to.have.length(1);
  });

  it("renders TextField", () => {
    expect(component.find(TextField)).to.have.length(1);
  });

  it("renders Field", () => {
    expect(component.find(Field)).to.have.length(2);
  });

  it("renders default label for SearchableSelect", () => {
    component.find("input").first().simulate("keyDown", {
      key: "ArrowDown",
      keyCode: keydown.DOM_VK_DOWN
    });

    expect(component.find("div.Mui-selected").text()).to.be.equal(
      "fields.select_single"
    );
  });
});
