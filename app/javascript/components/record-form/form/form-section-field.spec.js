import { mountedComponent, screen } from "../../../test-utils";
import { SELECT_FIELD } from "../constants";

import FormSectionField from "./form-section-field";
import { TEXT_FIELD_NAME } from "./constants";

describe("<FormSectionField />", () => {
  const props = {
    name: "Test",
    isReadWriteForm: false,
    field: {
      type: TEXT_FIELD_NAME,
      display_name: { en: "Test" },
      disabled: false
    },
    mode: {
      isShow: true
    },
    formSection: {}
  };

  it("render a FormSectionField", () => {
    mountedComponent(<FormSectionField {...props} />);
    expect(screen.queryByTestId(/form-section/i)).toBeNull();
  });

  describe("When is select field", () => {
    const selectFieldProps = {
      name: "Test",
      field: {
        type: SELECT_FIELD,
        display_name: { en: "Test" },
        disabled: false,
        visible: true,
        options: [{ id: 1, display_text: "test" }]
      },
      mode: {
        isEdit: true,
        isShow: false
      },
      isReadWriteForm: true
    };

    describe("and violationOptions is present ", () => {
      const violationOptions = [{ id: 2, display_text: "test2" }];
      const violationProps = { ...selectFieldProps, violationOptions };

      it("should pass it has options for select", () => {
        mountedComponent(<FormSectionField {...violationProps} />, {}, [], {}, { registerField: () => {} });
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });
    });

    describe("and violationOptions is NOT present ", () => {
      it("should pass it has options for select", () => {
        mountedComponent(<FormSectionField {...selectFieldProps} />, {}, [], {}, { registerField: () => {} });
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });
    });
  });
});
