import { fromJS, Map } from "immutable";
import { Form } from "formik";
import { TextField as MuiTextField } from "formik-material-ui";

import { setupMountedComponent } from "../../test";
import { RESOURCES } from "../../libs/permissions";
import { FormSectionField } from "../record-form";
import SearchableSelect from "../searchable-select";

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

  beforeEach(() => {
    ({ component } = setupMountedComponent(RecordOwner, rootProps, rootInitialState));
  });

  it("renders a RecordOwner component and its fields/>", () => {
    expect(component.find(RecordOwner)).to.have.lengthOf(1);
    expect(component.find(FormSectionField)).to.have.lengthOf(13);
    expect(component.find(SearchableSelect)).to.have.lengthOf(1);
    expect(component.find(SearchableSelect).props().defaultValues[0].id).to.equal("agency-unicef");
  });

  it("renders Form", () => {
    expect(component.find(Form)).to.have.lengthOf(1);
  });

  it("renders value for assigned_user_names", () => {
    const associatedUserNames = component.find(MuiTextField).at(2).props();

    expect(associatedUserNames.name).to.be.equal("assigned_user_names");
    expect(associatedUserNames.field.value).to.be.equal("primero_admin_cp, test_user");
  });

  it("renders value for previously_owned_by_agency", () => {
    const previouslyOwnedBy = component.find(MuiTextField).at(6).props();

    expect(previouslyOwnedBy.name).to.be.equal("previously_owned_by_agency");
    expect(previouslyOwnedBy.field.value).to.be.equal("TEST/AGENCY");
  });

  describe("with created_organization", () => {
    describe("when is an object", () => {
      it("renders value for created_organization", () => {
        const createOrganization = component.find(MuiTextField).at(4).props();

        expect(createOrganization.name).to.be.equal("created_organization");
        expect(createOrganization.field.value).to.be.equal("TEST");
      });
    });

    describe("when is a string", () => {
      it("renders value for created_organization", () => {
        const { component: componentWithStringOrganization } = setupMountedComponent(
          RecordOwner,
          { ...rootProps, record: record.set("created_organization", "AGENCY 1") },
          rootInitialState
        );
        const createOrganization = componentWithStringOrganization.find(MuiTextField).at(4).props();

        expect(createOrganization.name).to.be.equal("created_organization");
        expect(createOrganization.field.value).to.be.equal("AGENCY 1");
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
      ({ component } = setupMountedComponent(RecordOwner, props, initialState));
    });

    it("should render RecordOwner and its fields", () => {
      expect(component.find(RecordOwner)).to.have.lengthOf(1);
      expect(component.find(FormSectionField)).to.have.lengthOf(13);
      expect(component.find("input").first().prop("name")).to.be.equal("owned_by_text");
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
      ({ component } = setupMountedComponent(RecordOwner, props, initialState));
    });

    it("should render RecordOwner and its fields", () => {
      expect(component.find(RecordOwner)).to.have.lengthOf(1);
      expect(component.find(FormSectionField)).to.have.lengthOf(13);
      expect(component.find("input").first().prop("name")).to.be.equal("owned_by_text");
    });
  });
});
