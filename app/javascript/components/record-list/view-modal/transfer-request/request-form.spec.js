// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";

import RequestForm from "./request-form";

describe("<RequestForm />", () => {
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
    mountedComponent(<RequestForm {...props} />, {}, {}, [], formProps);
  });

  it("should render DisplayData", () => {
    expect(screen.getAllByTestId("display-data")).toHaveLength(2);
  });

  it("should render Field", () => {
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
