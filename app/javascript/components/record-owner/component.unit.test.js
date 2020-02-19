import { expect } from "chai";
import { fromJS, Map } from "immutable";
import { Form } from "formik";

import { setupMountedComponent } from "../../test";
import { RESOURCES } from "../../libs/permissions";
import { FormSectionField } from "../record-form";

import RecordOwner from "./component";

describe("<RecordOwner />", () => {
  let component;

  const record = fromJS({
    case_id: "12345",
    case_id_display: "3c9d076",
    date_of_birth: "2015-01-06",
    id: "1d8d84eb-25e3-4d8b-8c32-8452eee3e71c",
    module_id: "primeromodule-cp",
    name_first: "example",
    name_last: "case",
    owned_by: "primero",
    previously_owned_by: "primero",
    record_state: true,
    registration_date: "2020-01-06",
    sex: "male",
    short_id: "3c9d076",
    status: "open"
  });

  const props = {
    record,
    recordType: RESOURCES.cases
  };

  const initialState = Map({
    records: fromJS({
      cases: {
        data: [record]
      }
    }),
    forms: fromJS({
      selectedForm: "record_owner",
      selectedRecord: "1d8d84eb-25e3-4d8b-8c32-8452eee3e71c"
    })
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(RecordOwner, props, initialState));
  });

  it("renders a RecordOwner component and its fields/>", () => {
    expect(component.find(RecordOwner)).to.have.lengthOf(1);
    expect(component.find(FormSectionField)).to.have.lengthOf(12);
  });

  it("renders Form", () => {
    expect(component.find(Form)).to.have.lengthOf(1);
  });

  describe("when record is new", () => {
    const initialState = Map({
      records: fromJS({
        cases: {
          data: [{}]
        }
      }),
      forms: fromJS({
        selectedForm: "record_owner",
        selectedRecord: null
      })
    });

    const props = {
      record: null,
      recordType: RESOURCES.cases
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(RecordOwner, props, initialState));
    });

    it("should render RecordOwner and its fields", () => {
      expect(component.find(RecordOwner)).to.have.lengthOf(1);
      expect(component.find(FormSectionField)).to.have.lengthOf(12);
      expect(
        component
          .find("input")
          .first()
          .prop("name")
      ).to.be.equal("owned_by_text");
    });
  });

  describe("when record has not data for record_owner", () => {
    const recordWithRecordOwner = fromJS({
      case_id: "12345",
      case_id_display: "3c9d076",
      date_of_birth: "2015-01-06",
      id: "1d8d84eb-25e3-4d8b-8c32-8452eee3e71c",
      module_id: "primeromodule-cp",
      name_first: "example",
      name_last: "case",
      record_state: true,
      registration_date: "2020-01-06",
      sex: "male",
      short_id: "3c9d076",
      status: "open"
    });

    const initialState = Map({
      records: fromJS({
        cases: {
          data: [recordWithRecordOwner]
        }
      }),
      forms: fromJS({
        selectedForm: "record_owner",
        selectedRecord: recordWithRecordOwner.get("id")
      })
    });

    const props = {
      record: recordWithRecordOwner,
      recordType: RESOURCES.cases
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(RecordOwner, props, initialState));
    });

    it("should render RecordOwner and its fields", () => {
      expect(component.find(RecordOwner)).to.have.lengthOf(1);
      expect(component.find(FormSectionField)).to.have.lengthOf(12);
      expect(
        component
          .find("input")
          .first()
          .prop("name")
      ).to.be.equal("owned_by_text");
    });
  });
});
