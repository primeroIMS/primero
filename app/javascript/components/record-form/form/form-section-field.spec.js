import { mountedComponent, screen, userEvent } from "../../../test-utils";
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

      it("should have violation options for select", async () => {
        mountedComponent(<FormSectionField {...violationProps} />, {}, [], {}, { registerField: () => {} });

        const user = userEvent.setup();

        const autoCompleteDropdown = screen.getByRole("button", { name: "Open" });

        await user.click(autoCompleteDropdown);

        expect(screen.queryByText("test")).toBeNull();
        expect(screen.getByText("test2")).toBeInTheDocument();
      });
    });

    describe("and violationOptions is NOT present ", () => {
      it("should not have violation options for select", async () => {
        mountedComponent(<FormSectionField {...selectFieldProps} />, {}, [], {}, { registerField: () => {} });
        const user = userEvent.setup();

        const autoCompleteDropdown = screen.getByRole("button", { name: "Open" });

        await user.click(autoCompleteDropdown);

        expect(screen.getByText("test")).toBeInTheDocument();
        expect(screen.queryByText("test2")).toBeNull();
      });
    });
  });
});
