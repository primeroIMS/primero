// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, Map } from "immutable";

import { RESOURCES } from "../permissions";
import { mountedComponent, screen } from "../../test-utils";

import RecordOwner from "./component";

describe("<RecordOwner />", () => {
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
    status: "open",
    owned_by_agency_id: "agency-unicef",
    assigned_user_names: ["primero_admin_cp, test_user"],
    previously_owned_by_agency: "TEST/AGENCY",
    created_organization: { id: 1, agency_code: "TEST" }
  });

  const rootProps = {
    record,
    recordType: RESOURCES.cases,
    handleToggleNav: () => {},
    mobileDisplay: false
  };

  const rootInitialState = fromJS({
    records: {
      cases: {
        data: [record]
      }
    },
    forms: {
      selectedForm: "record_owner",
      selectedRecord: "1d8d84eb-25e3-4d8b-8c32-8452eee3e71c"
    },
    application: {
      agencies: [
        {
          id: 1,
          unique_id: "agency-unicef",
          name: "UNICEF",
          services: [],
          disabled: false
        }
      ]
    }
  });

  it("renders value for assigned_user_names", () => {
    mountedComponent(<RecordOwner {...rootProps} />, rootInitialState);
    expect(screen.getByLabelText("record_information.assigned_user_names")).toHaveValue("primero_admin_cp, test_user");
  });

  it("renders value for previously_owned_by_agency", () => {
    mountedComponent(<RecordOwner {...rootProps} />, rootInitialState);
    expect(screen.getByLabelText("record_information.previously_owned_by_agency")).toHaveValue("TEST/AGENCY");
  });

  describe("with created_organization", () => {
    describe("when is an object", () => {
      it("renders value for created_organization", () => {
        mountedComponent(<RecordOwner {...rootProps} />, rootInitialState);
        expect(screen.getByLabelText("record_information.created_organization")).toHaveValue("TEST");
      });
    });

    describe("when is a string", () => {
      it("renders value for created_organization", () => {
        const componentProps = { ...rootProps, record: record.set("created_organization", "AGENCY 1") };
        const { getByLabelText } = mountedComponent(<RecordOwner {...componentProps} />, rootInitialState);

        expect(getByLabelText("record_information.created_organization")).toHaveValue("AGENCY 1");
      });
    });
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
      recordType: RESOURCES.cases,
      handleToggleNav: () => {},
      mobileDisplay: false
    };

    beforeEach(() => {
      mountedComponent(<RecordOwner {...props} />, initialState);
    });

    it("should render RecordOwner and its fields", () => {
      expect(screen.getAllByTestId("form-section-field")).toHaveLength(12);
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
      recordType: RESOURCES.cases,
      handleToggleNav: () => {},
      mobileDisplay: false
    };

    beforeEach(() => {
      mountedComponent(<RecordOwner {...props} />, initialState);
    });

    it("should render RecordOwner and its fields", () => {
      expect(screen.getAllByTestId("form-section-field")).toHaveLength(12);
    });
  });
});
