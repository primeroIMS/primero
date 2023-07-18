/* eslint-disable no-unused-expressions */
import { Form, Formik } from "formik";

import { mountedComponent, screen } from "../../../../../test-utils";

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

  it("renders SearchableSelect", () => {
    mountedComponent(<InternalForm {...props} />);
    expect(screen.queryAllByRole("combobox")).toHaveLength(2);
  });

  it("renders TextField", () => {
    mountedComponent(<InternalForm {...props} />);
    expect(screen.queryAllByRole("textbox")).toHaveLength(3);
  });

  it("renders Field", () => {
    mountedComponent(<InternalForm {...props} />);
    expect(screen.queryAllByRole("textbox")).toHaveLength(3);
  });
  
});
