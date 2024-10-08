// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, Map } from "immutable";

import { mountedComponent, screen } from "../../../../../../../test-utils";
import { TRACING_REQUEST_STATUS_FIELD_NAME } from "../../../../../../../config";

import TracingRequestStatus from "./component";

describe("<RecordForm>/form/subforms/<SubformFields>/components/<TracingRequestStatus />", () => {
  const props = { values: { tracing_request_status: "status_1" } };

  it("should render the tracing request status", () => {
    mountedComponent(
      <TracingRequestStatus {...props} />,
      Map({
        forms: Map({
          fields: [{ name: TRACING_REQUEST_STATUS_FIELD_NAME, option_strings_source: "lookup lookup-test" }],
          options: fromJS({
            lookups: [
              { id: 1, unique_id: "lookup-test", values: [{ id: "status_1", display_text: { en: "Status 1" } }] }
            ]
          })
        })
      })
    );
    expect(screen.getByText(/status_1/i)).toBeInTheDocument();
  });
});
