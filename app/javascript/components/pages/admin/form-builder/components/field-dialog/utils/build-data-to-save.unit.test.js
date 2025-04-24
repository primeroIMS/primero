// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import uuid from "../../../../../../../libs/uuid";
import { TEXT_FIELD, SELECT_FIELD, DATE_FIELD } from "../../../../../../form";
import { NEW_FIELD } from "../../../constants";

import buildDataToSave from "./build-data-to-save";

describe("buildDataToSave", () => {
  beforeAll(() => {
    jest.spyOn(uuid, "v4").mockReturnValue("b8e93-0cce-415b-ad2b-d06bb454b66f");
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should set the data for update", () => {
    const selectedField = fromJS({
      name: "referral_person_phone",
      type: TEXT_FIELD
    });
    const fieldName = selectedField.get("name");
    const data = {
      referral_person_phone: {
        display_name: { en: "Contact Number aj" },
        guiding_questions: { en: "" },
        help_text: { en: "e" },
        mobile_visible: true,
        required: false,
        show_on_minify_form: false,
        visible: true,
        disabled: false
      }
    };

    expect(buildDataToSave(selectedField, data[fieldName], "en")).toEqual(data);
  });

  describe("when its a new field", () => {
    const objectData = {
      display_name: { en: "test field" },
      guiding_questions: { en: "" },
      help_text: { en: "e" },
      mobile_visible: true,
      required: false,
      show_on_minify_form: false,
      visible: true,
      multi_select: false,
      date_include_time: false,
      disabled: false
    };

    it("should set the data for create", () => {
      const selectedField = fromJS({ name: NEW_FIELD, type: TEXT_FIELD });

      expect(buildDataToSave(selectedField, objectData, 1)).toEqual({
        test_field_454b66f: {
          ...objectData,
          type: TEXT_FIELD,
          name: "test_field_454b66f",
          order: 2
        }
      });
    });

    it("should set the data for create SELECT_FIELD", () => {
      const selectedField = fromJS({
        name: NEW_FIELD,
        type: SELECT_FIELD,
        multi_select: true
      });
      const objectDataSelectField = {
        ...objectData,
        multi_select: true
      };

      expect(buildDataToSave(selectedField, objectDataSelectField, 1)).toEqual({
        test_field_454b66f: {
          ...objectDataSelectField,
          type: SELECT_FIELD,
          name: "test_field_454b66f",
          order: 2
        }
      });
    });

    it("should set the data for create DATE_FIELD", () => {
      const selectedField = fromJS({
        name: NEW_FIELD,
        type: DATE_FIELD,
        date_include_time: true
      });

      const objectDataDateTimeField = {
        ...objectData,
        date_include_time: true
      };

      expect(buildDataToSave(selectedField, objectDataDateTimeField, 1)).toEqual({
        test_field_454b66f: {
          ...objectDataDateTimeField,
          type: DATE_FIELD,
          name: "test_field_454b66f",
          order: 2
        }
      });
    });

    it("should replace the special characters with underscore for the field_name in the DB", () => {
      const selectedField = fromJS({
        name: NEW_FIELD,
        type: TEXT_FIELD
      });
      const data = {
        display_name: { en: "TEST field*name 1" },
        guiding_questions: { en: "" },
        help_text: { en: "e" },
        mobile_visible: true,
        required: false,
        show_on_minify_form: false,
        visible: true
      };
      const expected = "test_field_name_1_454b66f";

      expect(Object.keys(buildDataToSave(selectedField, data, "en", 1))[0]).toEqual(expected);
    });
  });
});
