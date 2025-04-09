// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Map, OrderedMap, fromJS } from "immutable";

import { FieldRecord, FormSectionRecord } from "../record-form/records";
import { RECORD_PATH } from "../../config";

import {
  selectRecord,
  selectRecordAttribute,
  selectRecordsByIndexes,
  getIncidentFromCase,
  getSavingRecord,
  getLoadingRecordState,
  getRecordAlerts,
  getCaseIdForIncident,
  getSelectedRecord,
  getRecordAttachments,
  getIsProcessingSomeAttachment,
  getIsProcessingAttachments,
  getIsPendingAttachments,
  getCasesPotentialMatches,
  getMatchedTraces,
  getLoadingCasesPotentialMatches,
  getMatchedTrace,
  getMarkForMobileLoading
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
const potentialMatches = [
  {
    likelihood: "likely",
    score: 1,
    case: {
      id: "b216d9a8-5390-4d20-802b-ae415151ddbf",
      case_id_display: "35e4065",
      name: "Enrique Bunbury"
    },
    trace: {
      id: "12345",
      inquiry_date: "2021-01-13",
      tracing_request_id: "f6c3483e-d6e6-482e-bd7a-9c5808e0798c",
      name: "Gustavo Cerati"
    },
    comparison: {
      case_to_trace: [
        {
          field_name: "age",
          match: "mismatch",
          case_value: 4,
          trace_value: 10
        }
      ]
    }
  }
];
const stateWithoutRecords = Map({});
const stateWithRecords = Map({
  records: fromJS({
    cases: {
      data: [record],
      potentialMatches: {
        data: potentialMatches,
        loading: false,
        errors: false
      },
      matchedTraces: {
        data: [
          {
            sex: "male",
            inquiry_date: "2021-01-13",
            tracing_request_id: "f6c3483e-d6e6-482e-bd7a-9c5808e0798c",
            name: "Gustavo Cerati",
            relation_name: null,
            matched_case_id: "b216d9a8-5390-4d20-802b-ae415151ddbf",
            inquirer_id: "dc7a9dde-0b80-4488-b480-35f571c977c3",
            id: "3d930cd0-de41-4c5b-959e-7bb6ca4b3f3e",
            relation: "brother",
            age: 10
          }
        ],
        loading: false,
        errors: false
      }
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

      const records = selectRecord(stateWithRecords, { isEditOrShow: mode, recordType, id });

      expect(records).toEqual(expected);
    });

    it("should return empty object when records empty", () => {
      const records = selectRecord(stateWithoutRecords, { isEditOrShow: false, recordType, id });

      expect(records).toBeNull();
    });
  });

  describe("selectRecordAttribute", () => {
    const attribute = "sex";

    it("should return records", () => {
      const expected = "male";

      const records = selectRecordAttribute(stateWithRecords, recordType, id, attribute);

      expect(records).toEqual(expected);
    });

    it("should return empty object when records empty", () => {
      const records = selectRecordAttribute(stateWithoutRecords, recordType, id, attribute);

      expect(Object.keys(records)).toHaveLength(0);
    });
  });

  describe("selectRecordsByIndexes", () => {
    const indexes = [0];

    it("should return records", () => {
      const expected = [fromJS(record)];

      const records = selectRecordsByIndexes(stateWithRecords, recordType, indexes);

      expect(records).toEqual(expected);
    });

    it("should return empty array when records empty", () => {
      const records = selectRecordsByIndexes(stateWithoutRecords, recordType, []);

      expect(Object.keys(records)).toHaveLength(0);
    });
  });

  describe("getSavingRecord", () => {
    const stateWithSavingTrue = Map({ records: { cases: { saving: true } } });
    const stateWithSavingFalse = Map({
      records: { cases: { saving: false } }
    });

    it("should return saving state value", () => {
      const savingState = getSavingRecord(stateWithSavingTrue, recordType);

      expect(savingState).toBe(true);
    });

    it("should return false when there is not any saving state", () => {
      const savingState = getSavingRecord(stateWithSavingFalse, recordType);

      expect(savingState).toBe(false);
    });
  });

  describe("getLoadingRecordState", () => {
    const stateWithLoadingTrue = Map({ records: { cases: { loading: true } } });
    const stateWithLoadingFalse = Map({
      records: { cases: { loading: false } }
    });

    it("should return loading state value", () => {
      const loadingState = getLoadingRecordState(stateWithLoadingTrue, recordType);

      expect(loadingState).toBe(true);
    });

    it("should return false when there is not any loading state", () => {
      const loadingState = getLoadingRecordState(stateWithLoadingFalse, recordType);

      expect(loadingState).toBe(false);
    });
  });

  describe("getMarkForMobileLoading", () => {
    const stateWithLoadingTrue = Map({ records: { cases: { markForMobileLoading: true } } });
    const stateWithLoadingFalse = Map({
      records: { cases: { markForMobileLoading: false } }
    });

    it("should return loading state value", () => {
      const loadingState = getMarkForMobileLoading(stateWithLoadingTrue, recordType);

      expect(loadingState).toBe(true);
    });

    it("should return false when there is not any loading state", () => {
      const loadingState = getMarkForMobileLoading(stateWithLoadingFalse, recordType);

      expect(loadingState).toBe(false);
    });
  });

  describe("getRecordAlerts", () => {
    const stateWithRecordAlerts = fromJS({
      records: {
        cases: {
          selectedForm: "basic_identity",
          recordAlerts: [
            {
              alert_for: "field_change",
              type: "notes",
              date: "2020-04-02",
              form_unique_id: "notes"
            }
          ]
        }
      }
    });

    it("should return the list of alerts", () => {
      const expected = fromJS([
        {
          alert_for: "field_change",
          type: "notes",
          date: "2020-04-02",
          form_unique_id: "notes"
        }
      ]);

      expect(getRecordAlerts(stateWithRecordAlerts, RECORD_PATH.cases)).toEqual(expected);
    });

    it("should return an empty array when there are not any options", () => {
      const recordAlert = getRecordAlerts(fromJS({}));

      expect(recordAlert.size).toBe(0);
    });
  });

  describe("getIncidentFromCase", () => {
    const incidentFromCase = fromJS({
      owned_by: "user_1",
      enabled: true,
      status: "open"
    });

    const stateWithIncidentFromCase = fromJS({
      records: { cases: { incidentFromCase: { data: incidentFromCase } } }
    });

    it("should return the incident when is a new incident", () => {
      expect(getIncidentFromCase(stateWithIncidentFromCase)).toEqual(incidentFromCase);
    });
  });

  describe("getCaseIdForIncident", () => {
    const stateWithIncidentFromCase = fromJS({
      records: { cases: { incidentFromCase: { incident_case_id: "123456789" } } }
    });

    it("should return the incident_case_id when is a new incident", () => {
      expect(getCaseIdForIncident(stateWithIncidentFromCase)).toEqual("123456789");
    });
  });

  describe("getSelectedRecord", () => {
    const stateWithSelectedRecord = fromJS({
      records: { cases: { selectedRecord: "123456789" } }
    });

    it("should return the selectedRecord", () => {
      expect(getSelectedRecord(stateWithSelectedRecord, RECORD_PATH.cases)).toBe("123456789");
    });
  });

  describe("getRecordAttachments", () => {
    const attachmentField = {
      field: { processing: false, data: [{ id: 1, attachment: "attachment-data" }] }
    };
    const stateWithRecordAttachments = fromJS({ records: { cases: { recordAttachments: { ...attachmentField } } } });

    it("should return the attachments", () => {
      expect(getRecordAttachments(stateWithRecordAttachments, RECORD_PATH.cases)).toEqual(fromJS(attachmentField));
    });
  });

  describe("getIsProcessingSomeAttachment", () => {
    it("should return the true if the some attachment field has attachments being processed", () => {
      const attachmentFields = {
        field_1: { processing: false, data: [{ id: 1, attachment: "attachment-data" }] },
        field_2: { processing: true, data: [{ id: 1, attachment: "attachment-data" }] }
      };
      const stateWithRecordAttachments = fromJS({ records: { cases: { recordAttachments: { ...attachmentFields } } } });

      expect(getIsProcessingSomeAttachment(stateWithRecordAttachments, RECORD_PATH.cases)).toBe(true);
    });

    it("should return the false if the no attachment field has attachments being processed", () => {
      const attachmentFields = {
        field_1: { processing: false, data: [{ id: 1, attachment: "attachment-data" }] },
        field_2: { processing: false, data: [{ id: 1, attachment: "attachment-data" }] }
      };
      const stateWithRecordAttachments = fromJS({ records: { cases: { recordAttachments: { ...attachmentFields } } } });

      expect(getIsProcessingSomeAttachment(stateWithRecordAttachments, RECORD_PATH.cases)).toBe(false);
    });
  });

  describe("getIsProcessingAttachments", () => {
    it("should return the true if the attachment field has attachments being processed", () => {
      const attachmentFields = {
        field_1: { processing: true, data: [{ id: 1, attachment: "attachment-data" }] }
      };
      const stateWithRecordAttachments = fromJS({ records: { cases: { recordAttachments: { ...attachmentFields } } } });

      expect(getIsProcessingAttachments(stateWithRecordAttachments, RECORD_PATH.cases, "field_1")).toBe(true);
    });

    it("should return the false if the attachment field doesn't have attachments being processed", () => {
      const attachmentFields = {
        field_1: { processing: false, data: [{ id: 1, attachment: "attachment-data" }] }
      };
      const stateWithRecordAttachments = fromJS({ records: { cases: { recordAttachments: { ...attachmentFields } } } });

      expect(getIsProcessingAttachments(stateWithRecordAttachments, RECORD_PATH.cases, "field_1")).toBe(false);
    });
  });

  describe("getIsPendingAttachments", () => {
    it("should return the true if the attachment field has pending attachments", () => {
      const attachmentFields = {
        field_1: { pending: true, data: [{ id: 1, attachment: "attachment-data" }] }
      };
      const stateWithRecordAttachments = fromJS({ records: { cases: { recordAttachments: { ...attachmentFields } } } });

      expect(getIsPendingAttachments(stateWithRecordAttachments, RECORD_PATH.cases, "field_1")).toBe(true);
    });

    it("should return the false if the attachment field doesn't have pending attachments", () => {
      const attachmentFields = {
        field_1: { pending: false, data: [{ id: 1, attachment: "attachment-data" }] }
      };
      const stateWithRecordAttachments = fromJS({ records: { cases: { recordAttachments: { ...attachmentFields } } } });

      expect(getIsPendingAttachments(stateWithRecordAttachments, RECORD_PATH.cases, "field_1")).toBe(false);
    });
  });

  describe("getCasesPotentialMatches", () => {
    it("should return the potentialMatches values", () => {
      const expected = fromJS(potentialMatches);

      expect(getCasesPotentialMatches(stateWithRecords)).toEqual(expected);
    });

    it("should return empty object", () => {
      expect(getCasesPotentialMatches(stateWithoutRecords).size).toBe(0);
    });
  });

  describe("getMatchedTraces", () => {
    it("should return the potentialMatches values", () => {
      const expected = fromJS([
        {
          sex: "male",
          inquiry_date: "2021-01-13",
          tracing_request_id: "f6c3483e-d6e6-482e-bd7a-9c5808e0798c",
          name: "Gustavo Cerati",
          relation_name: null,
          matched_case_id: "b216d9a8-5390-4d20-802b-ae415151ddbf",
          inquirer_id: "dc7a9dde-0b80-4488-b480-35f571c977c3",
          id: "3d930cd0-de41-4c5b-959e-7bb6ca4b3f3e",
          relation: "brother",
          age: 10
        }
      ]);

      expect(getMatchedTraces(stateWithRecords)).toEqual(expected);
    });

    it("should return empty object", () => {
      expect(getMatchedTraces(stateWithoutRecords).size).toBe(0);
    });
  });

  describe("getLoadingCasesPotentialMatches", () => {
    it("should return the loading value for potentialMatches object", () => {
      expect(getLoadingCasesPotentialMatches(stateWithRecords)).toBe(false);
    });
  });

  describe("getMatchedTrace", () => {
    it("should return the potentialMatches values", () => {
      const expected = fromJS(potentialMatches[0]);

      expect(getMatchedTrace(stateWithRecords, "12345")).toEqual(expected);
    });

    it("should return empty object", () => {
      expect(getMatchedTrace(stateWithoutRecords).size).toBe(0);
    });
  });
});
