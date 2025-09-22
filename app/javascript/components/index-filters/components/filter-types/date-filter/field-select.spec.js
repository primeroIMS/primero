// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";

import FieldSelect from "./field-select";

describe("FieldSelect", () => {
  describe("when options has only one option", () => {
    beforeEach(() => {
      mountedComponent(
        <FieldSelect
          options={[
            {
              id: "timestamp",
              display_name: "Timestamp"
            }
          ]}
          selectedField="timestamp"
          handleSelectedField={() => {}}
        />
      );
    });

    it("renders hidden field", () => {
      const hiddenInput = screen.getByTestId("selected-field-hidden");

      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveValue("timestamp");
    });
  });
  describe("when options has multiple option", () => {
    beforeEach(() => {
      mountedComponent(
        <FieldSelect
          options={[
            {
              id: "last_access",
              display_name: "Date of Last Log In"
            },
            {
              id: "last_case_viewed",
              display_name: "Date of Last Case View"
            }
          ]}
          selectedField="timestamp"
          handleSelectedField={() => {}}
        />
      );
    });

    it("renders Select", () => {
      const selectField = screen.getByTestId("selected-field-select");

      expect(selectField).toBeInTheDocument();
    });
  });
});
