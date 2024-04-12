import { mountedComponent, screen } from "../../../../test-utils";
import KeyValueCell from "./component";

describe("components/record-actions/exports/components/pdf-exporter/components/key-value-cell", () => {
  const state = {
    forms: {
      options: {
        lookups: [
          {
            unique_id: "lookup-1",
            name: { en: "Lookup 1" },
            values: [
              { id: "option-1", display_text: { en: "Option 1" } },
              { id: "option-2", display_text: { en: "Option 2" } },
              { id: "option-3", display_text: { en: "Option 3" } }
            ]
          }
        ]
      }
    }
  };

  it("renders key/value with string value", () => {
    const props = {
      displayName: "Form 1",
      value: "option-1",
      optionsStringSource: "lookup lookup-1",
      classes: {}
    };

    mountedComponent(<KeyValueCell {...props} />, state);

    expect(screen.getByText("Form 1")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("renders key/value with array value", () => {
    const props = {
      displayName: "Form 1",
      value: "option-3",
      optionsStringSource: "lookup lookup-1",
      classes: {}
    };

    mountedComponent(<KeyValueCell {...props} />, state);

    expect(screen.getByText("Form 1")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });
});
