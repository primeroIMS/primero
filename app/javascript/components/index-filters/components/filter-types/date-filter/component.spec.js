import { screen, mountedFormComponent } from "test-utils";

import { DATE_FORMAT, DATE_TIME_FORMAT } from "../../../../../config";

import DateFilter from "./component";

describe("<DateFilter>", () => {
  const filter = {
    field_name: "filter",
    name: "Filter 1",
    options: {
      en: [
        { id: "option-1", display_text: "Option 1" },
        { id: "option-2", display_text: "Option 2" }
      ]
    }
  };

  const props = {
    addFilterToList: () => {},
    filter,
    filterToList: {}
  };

  it("renders panel", () => {
    mountedFormComponent(<DateFilter {...props} />, { includeFormProvider: true });
    expect(screen.getByText("Filter 1")).toBeInTheDocument();
  });

  describe("When is Date format", () => {
    it("render 2 DatePicker component", () => {
      mountedFormComponent(<DateFilter {...props} />, { includeFormProvider: true });

      expect(screen.getAllByText("fields.date_range.from", { selector: "span" })).toHaveLength(1);
      expect(screen.getAllByText("fields.date_range.to", { selector: "span" })).toHaveLength(1);
    });

    it("specify format", () => {
      mountedFormComponent(<DateFilter {...props} />, { includeFormProvider: true });
      const dateFormat = document.querySelector('div[format="dd-MMM-yyyy"]');

      expect(dateFormat).toBeInTheDocument();
      expect(dateFormat).toHaveAttribute("format", DATE_FORMAT);
    });
  });

  describe("When is Date format", () => {
    const newProps = {
      addFilterToList: () => {},
      filter: { ...filter, dateIncludeTime: true },
      filterToList: {}
    };

    it("render 2 DatePicker component", () => {
      mountedFormComponent(<DateFilter {...newProps} />, { includeFormProvider: true });

      expect(screen.getAllByText("fields.date_range.from", { selector: "span" })).toHaveLength(1);
      expect(screen.getAllByText("fields.date_range.to", { selector: "span" })).toHaveLength(1);
    });

    it("specify format", () => {
      mountedFormComponent(<DateFilter {...newProps} />, { includeFormProvider: true });
      const dateFormat = document.querySelector('div[format="dd-MMM-yyyy HH:mm"]');

      expect(dateFormat).toBeInTheDocument();
      expect(dateFormat).toHaveAttribute("format", DATE_TIME_FORMAT);
    });
  });
});
