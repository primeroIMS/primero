import { expect } from "chai";
import { Field } from "formik";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import DisplayData from "../../../display-data/component";

import RequestForm from "./request-form";

describe("<RequestForm />", () => {
  let component;
  const record = fromJS({
    id: "03cdfdfe-a8fc-4147-b703-df976d200977",
    case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
    case_id_display: "9b4c525",
    name_first: "Name",
    name_last: "Last",
    name: "Name Last",
    owned_by: "primero"
  });

  const formProps = {
    initialValues: {
      notes: ""
    }
  };

  const props = {
    formProps: {
      handleSubmit: () => {}
    },
    record
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      RequestForm,
      props,
      {},
      {},
      formProps
    ));
  });

  it("should render DisplayData", () => {
    expect(component.find(DisplayData)).to.have.lengthOf(2);
  });

  it("should render Field", () => {
    expect(component.find(Field)).to.have.lengthOf(1);
  });

  it("should accept valid props", () => {
    const requestFormProps = { ...component.find(RequestForm).props() };

    expect(component.find(RequestForm)).to.have.lengthOf(1);
    ["formProps", "record"].forEach(property => {
      expect(requestFormProps).to.have.property(property);
      delete requestFormProps[property];
    });
    expect(requestFormProps).to.be.empty;
  });
});
