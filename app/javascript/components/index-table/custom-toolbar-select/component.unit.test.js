import { ButtonBase, Typography } from "@material-ui/core";

import { setupMountedComponent, stub } from "../../../test";
import { RECORD_PATH } from "../../../config";

import CustomToolbarSelect from "./component";

describe("<CustomToolbarSelect />", () => {
  let component;

  const arrayIndex = [0, 1, 2, 3];
  const props = {
    displayData: arrayIndex,
    recordType: RECORD_PATH.cases,
    perPage: 4,
    selectedRecords: { 0: arrayIndex },
    selectedRows: { data: { length: 4 } },
    setSelectedRecords: stub(),
    totalRecords: 7
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(CustomToolbarSelect, props));
  });

  it("renders Typography", () => {
    const label = component.find(Typography);

    expect(label).to.have.lengthOf(1);
    expect(label.text()).to.eql("cases.selected_records");
  });

  describe("when all records of the page are selected", () => {
    it("renders ButtonBase with a label to select all records", () => {
      const button = component.find(ButtonBase);

      expect(button).to.have.lengthOf(1);
      expect(button.text()).to.eql("cases.selected_all_records");
    });
  });

  describe("when all records are selected", () => {
    const propsAllRecordsSelected = {
      ...props,
      selectedRecords: { 0: arrayIndex, 1: [0, 1, 2] }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        CustomToolbarSelect,
        propsAllRecordsSelected
      ));
    });

    it("renders ButtonBase with a label to clear selection", () => {
      const button = component.find(ButtonBase);

      expect(button).to.have.lengthOf(1);
      expect(button.text()).to.eql("buttons.clear_selection");
    });
  });

  describe("when some records are selected", () => {
    const propRecordsSelected = {
      ...props,
      selectedRows: { data: { length: 3 } },
      selectedRecords: { 0: [0, 1, 2] }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        CustomToolbarSelect,
        propRecordsSelected
      ));
    });

    it("should not renders ButtonBase", () => {
      expect(component.find(ButtonBase)).to.have.lengthOf(0);
    });
  });
});
