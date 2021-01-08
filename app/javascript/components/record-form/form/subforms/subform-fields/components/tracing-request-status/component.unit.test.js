import { fromJS, Map } from "immutable";

import { setupMountedComponent } from "../../../../../../../test";
import { TRACING_REQUEST_STATUS_FIELD_NAME } from "../../../../../../../config";

import TracingRequestStatus from "./component";

describe("<RecordForm>/form/subforms/<SubformFields>/components/<TracingRequestStatus />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      TracingRequestStatus,
      { values: { tracing_request_status: "status_1" } },
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
    ));
  });

  it("should render the tracing request status", () => {
    expect(component.find(TracingRequestStatus)).to.have.lengthOf(1);
  });
});
