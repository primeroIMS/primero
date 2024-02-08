import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../../../test-utils";
import { FieldRecord } from "../../../../../records";

import ViolationItem from "./component";

describe("<RecordForm>/form/subforms/<SubformFields>/components/<ViolationItem />", () => {
  const initialState = fromJS({
    forms: {
      options: {
        lookups: [
          {
            unique_id: "lookup-status",
            values: [
              { id: "status_1", display_text: { en: "status 1" } },
              { id: "status_2", display_text: { en: "status 2" } }
            ]
          }
        ]
      }
    }
  });

  it("should render component", () => {
    const props = {
      fields: [
        FieldRecord({
          name: "relation_name",
          visible: true,
          type: "text_field"
        }),
        FieldRecord({
          name: "relation_child_is_in_contact",
          visible: true,
          type: "text_field"
        }),
        FieldRecord({
          name: "verified",
          visible: true,
          type: "text_field",
          option_strings_source: "lookup lookup-status"
        }),
        FieldRecord({
          name: "violation_tally",
          visible: true,
          type: "tally_field",
          display_name: { en: "violation count" }
        })
      ],
      values: [{ unique_id: "ab123cde", relation_name: "this is a relation" }],
      locale: "en",
      displayName: { en: "Testing" },
      index: 0
    };

    mountedComponent(<ViolationItem {...props} />, initialState);
    expect(screen.getByTestId("violation-item")).toBeInTheDocument();

  });
});
