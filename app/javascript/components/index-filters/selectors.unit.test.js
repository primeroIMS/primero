// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { RECORD_PATH } from "../../config";
import { PrimeroModuleRecord } from "../application/records";
import { FieldRecord } from "../record-form/records";
import { mapEntriesToRecord } from "../../libs";

import { getFiltersByRecordType, getFiltersValuesByRecordType, getTooltipFields } from "./selectors";

const stateWithoutRecords = fromJS({});

const fields = {
  1: {
    name: "name",
    type: "text_field",
    editable: true,
    visible: true,
    display_name: {
      en: "Name",
      es: "Nombre"
    },
    required: true
  },
  2: {
    name: "short_id",
    type: "text_field",
    editable: true,
    visible: true,
    display_name: {
      en: "Short ID",
      es: "ID corto"
    },
    required: true
  },
  3: {
    name: "case_id",
    type: "text_field",
    editable: true,
    visible: true,
    display_name: {
      en: "Case ID",
      es: "ID del caso"
    },
    required: true
  }
};

const state = fromJS({
  user: {
    modules: ["test1"],
    filters: {
      cases: [
        {
          unique_id: "filter1",
          field_name: "filter1",
          name: "filter1",
          options: { en: [{ id: "true", display_name: "Filter 1" }] },
          type: "toggle"
        }
      ],
      incidents: [
        {
          unique_id: "filter2",
          field_name: "filter2",
          name: "filter3",
          options: { en: [{ id: "true", display_name: "Filter 3" }] },
          type: "toggle"
        }
      ]
    }
  },
  records: {
    cases: {
      filters: {
        filter1: true
      }
    }
  },
  application: {
    modules: [PrimeroModuleRecord({ unique_id: "test1", list_filters: { cases: ["filter1"] } })],
    exactSearchFields: { cases: ["short_id", "case_id"] },
    phoneticSearchFields: { cases: ["name"] }
  },
  forms: {
    fields: mapEntriesToRecord(fields, FieldRecord)
  }
});

describe("<IndexFilters /> - Selectors", () => {
  describe("getFiltersValuesByRecordType", () => {
    it("should return list of filters", () => {
      const expected = fromJS([
        {
          unique_id: "filter1",
          field_name: "filter1",
          name: "filter1",
          options: { en: [{ id: "true", display_name: "Filter 1" }] },
          type: "toggle"
        }
      ]);

      const records = getFiltersByRecordType(state, RECORD_PATH.cases);

      expect(records).toEqual(expected);
    });

    it("should return empty list", () => {
      const records = getFiltersByRecordType(stateWithoutRecords, RECORD_PATH.cases);

      expect(records.size).toBe(0);
    });
  });

  describe("getFiltersValuesByRecordType", () => {
    it("should return list of applied filters", () => {
      const expected = fromJS({
        filter1: true
      });

      const records = getFiltersValuesByRecordType(state, RECORD_PATH.cases);

      expect(records).toEqual(expected);
    });

    it("should return empty map", () => {
      const records = getFiltersValuesByRecordType(stateWithoutRecords, RECORD_PATH.cases);

      expect(records.size).toBe(0);
    });
  });

  describe("getTooltipFields", () => {
    describe("when isPhonetic is true", () => {
      it("return list of display_name fields", () => {
        const expected = [{ en: "Name", es: "Nombre" }];

        const records = getTooltipFields(state, RECORD_PATH.cases, true);

        expect(records).toEqual(expected);
      });
    });
    describe("when isPhonetic is false", () => {
      it("return list of fields", () => {
        const expected = [
          { en: "Short ID", es: "ID corto" },
          { en: "Case ID", es: "ID del caso" }
        ];

        const records = getTooltipFields(state, RECORD_PATH.cases, false);

        expect(records).toEqual(expected);
      });
    });

    it("when recordType is empty should return empty", () => {
      const records = getTooltipFields(state, "", false);

      expect(records).toBeNull();
    });
  });
});
