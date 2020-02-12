import { expect } from "chai";
import { Map, OrderedMap, fromJS } from "immutable";

import { FieldRecord, FormSectionRecord } from "../record-form/records";
import { RECORD_PATH } from "../../config";

import {
  selectRecord,
  selectRecordAttribute,
  selectRecordsByIndexes,
  getSavingRecord,
  getLoadingRecordState
} from "./selectors";

const record = {
  sex: "male",
  created_at: "2020-01-07T14:27:04.136Z",
  name: "G P",
  case_id_display: "96f613f",
  owned_by: "primero_cp",
  status: "open",
  registration_date: "2020-01-07",
  id: "d9df44fb-95d0-4407-91fd-ed18c19be1ad"
};
const stateWithoutRecords = Map({});
const stateWithRecords = Map({
  records: fromJS({
    cases: {
      data: [record]
    }
  }),
  forms: Map({
    formSections: OrderedMap({
      1: FormSectionRecord({
        id: 1,
        unique_id: "incident_details_subform_section",
        name: { en: "Nested Incident Details Subform" },
        visible: false,
        is_first_tab: false,
        order: 20,
        order_form_group: 110,
        parent_form: "case",
        editable: true,
        module_ids: [],
        form_group_id: "",
        form_group_name: { en: "Nested Incident Details Subform" },
        fields: [2],
        is_nested: true,
        subform_prevent_item_removal: false,
        collapsed_field_names: ["cp_incident_date", "cp_incident_violence_type"]
      }),
      2: FormSectionRecord({
        id: 2,
        unique_id: "incident_details_container",
        name: { en: "Incident Details" },
        visible: true,
        is_first_tab: false,
        order: 0,
        order_form_group: 30,
        parent_form: "case",
        editable: true,
        module_ids: ["primeromodule-cp"],
        form_group_id: "identification_registration",
        form_group_name: { en: "Identification / Registration" },
        fields: [1],
        is_nested: false,
        subform_prevent_item_removal: false,
        collapsed_field_names: []
      })
    }),
    fields: OrderedMap({
      1: FieldRecord({
        name: "incident_details",
        type: "subform",
        editable: true,
        disabled: false,
        visible: true,
        subform_section_id: 1,
        help_text: { en: "" },
        display_name: { en: "" },
        multi_select: false,
        option_strings_source: null,
        option_strings_text: {},
        guiding_questions: "",
        required: false,
        date_validation: "default_date_validation",
        hide_on_view_page: false,
        date_include_time: false,
        selected_value: "",
        subform_sort_by: "summary_date",
        show_on_minify_form: false
      }),
      2: FieldRecord({
        name: "cp_incident_location_type_other",
        type: "text_field",
        editable: true,
        disabled: false,
        visible: true,
        subform_section_id: null,
        help_text: {},
        multi_select: false,
        option_strings_source: null,
        option_strings_text: {},
        guiding_questions: "",
        required: false,
        date_validation: "default_date_validation",
        hide_on_view_page: false,
        date_include_time: false,
        selected_value: "",
        subform_sort_by: "",
        show_on_minify_form: false
      })
    })
  })
});

describe("Records - Selectors", () => {
  const id = "d9df44fb-95d0-4407-91fd-ed18c19be1ad";
  const recordType = RECORD_PATH.cases;
  const mode = { isNew: false, isEdit: false, isShow: true };

  describe("selectRecord", () => {
    it("should return records", () => {
      const expected = fromJS(record);

      const records = selectRecord(stateWithRecords, mode, recordType, id);

      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const records = selectRecord(
        stateWithoutRecords,
        { ...mode, isNew: true, isShow: false },
        recordType,
        id
      );

      expect(records).to.be.null;
    });
  });

  describe("selectRecordAttribute", () => {
    const attribute = "sex";

    it("should return records", () => {
      const expected = "male";

      const records = selectRecordAttribute(
        stateWithRecords,
        recordType,
        id,
        attribute
      );

      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const records = selectRecordAttribute(
        stateWithoutRecords,
        recordType,
        id,
        attribute
      );

      expect(records).to.be.empty;
    });
  });

  describe("selectRecordsByIndexes", () => {
    const indexes = [0];

    it("should return records", () => {
      const expected = [fromJS(record)];

      const records = selectRecordsByIndexes(
        stateWithRecords,
        recordType,
        indexes
      );

      expect(records).to.deep.equal(expected);
    });

    it("should return empty array when records empty", () => {
      const records = selectRecordsByIndexes(
        stateWithoutRecords,
        recordType,
        []
      );

      expect(records).to.be.empty;
    });
  });

  describe("getSavingRecord", () => {
    const stateWithSavingTrue = Map({ records: { cases: { saving: true } } });
    const stateWithSavingFalse = Map({
      records: { cases: { saving: false } }
    });

    it("should return saving state value", () => {
      const savingState = getSavingRecord(stateWithSavingTrue, recordType);

      expect(savingState).to.be.true;
    });

    it("should return false when there is not any saving state", () => {
      const savingState = getSavingRecord(stateWithSavingFalse, recordType);

      expect(savingState).to.be.false;
    });
  });

  describe("getLoadingState", () => {
    const stateWithLoadingTrue = Map({ records: { cases: { loading: true } } });
    const stateWithLoadingFalse = Map({
      records: { cases: { loading: false } }
    });

    it("should return loading state value", () => {
      const loadingState = getLoadingRecordState(
        stateWithLoadingTrue,
        recordType
      );

      expect(loadingState).to.be.true;
    });

    it("should return false when there is not any loading state", () => {
      const loadingState = getLoadingRecordState(
        stateWithLoadingFalse,
        recordType
      );

      expect(loadingState).to.be.false;
    });
  });
});
