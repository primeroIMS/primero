import { fromJS, OrderedMap } from "immutable";

import { FieldRecord } from "../record-form/records";
import { stub } from "../../test";

import { ChangeLogsRecord } from "./records";
import { buildDataItems, buildSubformDataItems } from "./utils";

describe("ChangeLogs - Utils", () => {
  const i18n = { t: item => item, locale: "en", localizeDate: () => {} };
  const allFields = OrderedMap({
    0: FieldRecord({
      id: 1,
      name: "name_nickname",
      type: "text_field",
      editable: true,
      disabled: null,
      visible: true,
      display_name: {
        en: "Nickname"
      },
      subform_section_id: null,
      help_text: {},
      multi_select: null,
      option_strings_source: null,
      option_strings_text: null,
      guiding_questions: "",
      required: true,
      date_validation: "default_date_validation"
    }),
    1: FieldRecord({
      id: 1,
      name: "nationality",
      type: "select_box",
      editable: true,
      disabled: null,
      visible: true,
      display_name: {
        en: "Nationality"
      },
      subform_section_id: null,
      help_text: {},
      multi_select: null,
      option_strings_source: "lookup lookup-country",
      option_strings_text: null,
      guiding_questions: "",
      required: true,
      date_validation: "default_date_validation"
    }),
    2: FieldRecord({
      id: 1,
      name: "felt_stigma_section",
      type: "subform",
      editable: true,
      disabled: null,
      visible: true,
      display_name: {
        en: "Felt Stigma"
      },
      subform_section_id: null,
      help_text: {},
      multi_select: null,
      option_strings_source: null,
      option_strings_text: null,
      guiding_questions: "",
      required: true,
      date_validation: "default_date_validation"
    })
  });
  const lookups = fromJS([
    {
      id: 1,
      name: { en: "Nationality" },
      unique_id: "lookup-country",
      values: [
        { id: "australia", display_text: { en: "Australia" } },
        { id: "canada", display_text: { en: "Canada" } },
        { id: "india", display_text: { en: "India" } }
      ]
    },
    {
      id: 2,
      name: { en: "Yes or No" },
      unique_id: "lookup-yes-no",
      values: [
        { id: "true", display_text: { en: "Yes" } },
        { id: "false", display_text: { en: "No" } }
      ]
    }
  ]);
  const locations = fromJS([{ id: 1, code: "location-1", admin_level: 1 }]);
  const allAgencies = fromJS([{ id: "agency1", display_text: "Agency 1" }]);

  describe("getDataItems ", () => {
    const recordChangeLogs = fromJS([
      ChangeLogsRecord({
        record_id: "c26066b6-75f2-48d3-b249-88b360dbff59",
        record_type: "cases",
        datetime: "2020-12-03T21:11:01Z",
        user_name: "primero",
        action: "update",
        record_changes: [
          {
            age: {
              to: 5,
              from: 3
            }
          },
          {
            date_of_birth: {
              to: "2015-01-01",
              from: "2017-01-01"
            }
          },
          {
            gbv_ethnicity: {
              to: "ethnicity9",
              from: null
            }
          },
          {
            country_of_origin: {
              to: "australia",
              from: null
            }
          },
          {
            felt_stigma_section: {
              to: [
                {
                  unique_id: "f6c8baf0-d899-404f-a92c-a8e607e3eb0d",
                  feeling_detached: "scale_one",
                  felt_stigma_score: 1,
                  feeling_badly_treated: "scale_zero",
                  feelings_worthlessness: "scale_zero",
                  wanting_to_avoid_people: "scale_zero"
                }
              ],
              from: null
            }
          }
        ]
      }),
      ChangeLogsRecord({
        record_id: "c26066b6-75f2-48d3-b249-88b360dbff59",
        record_type: "cases",
        datetime: "2020-12-03T21:09:40Z",
        user_name: "primero",
        action: "create",
        record_changes: []
      })
    ]);

    const handleSeeDetails = () => {};

    const result = [
      {
        date: "2020-12-03T21:11:01Z",
        user: "primero",
        key: 12340001,
        isSubform: false,
        change: {
          from: 3,
          name: "age",
          to: 5
        }
      },
      {
        date: "2020-12-03T21:11:01Z",
        user: "primero",
        key: 12340001,
        isSubform: false,
        change: {
          from: "2017-01-01",
          name: "date_of_birth",
          to: "2015-01-01"
        }
      },
      {
        date: "2020-12-03T21:11:01Z",
        user: "primero",
        key: 12340001,
        isSubform: false,
        change: {
          from: "--",
          name: "gbv_ethnicity",
          to: "ethnicity9"
        }
      },
      {
        date: "2020-12-03T21:11:01Z",
        user: "primero",
        key: 12340001,
        isSubform: false,
        change: {
          from: "--",
          name: "country_of_origin",
          to: "australia"
        }
      },
      {
        date: "2020-12-03T21:11:01Z",
        user: "primero",
        key: 12340001,
        isSubform: true,
        title: "change_logs.update_subform"
      },
      {
        date: "2020-12-03T21:09:40Z",
        user: "primero",
        key: 12340001,
        title: "change_logs.create"
      }
    ];

    it("should return an array of object with logs ready to be render", () => {
      stub(Math, "random").returns(1234);
      const response = buildDataItems(
        recordChangeLogs,
        allFields,
        allAgencies,
        lookups,
        locations,
        handleSeeDetails,
        i18n
      );

      // eslint-disable-next-line no-param-reassign
      response.forEach(obj => delete obj.onClick);

      expect(response).to.deep.equal(result);
    });
  });

  describe("getSubformDataItems ", () => {
    const recordChanges = {
      value: {
        to: [
          {
            unique_id: "f6c8baf0-d899-404f-a92c-a8e607e3eb0d",
            feeling_detached: "scale_one",
            felt_stigma_score: 1,
            feeling_badly_treated: "scale_zero",
            feelings_worthlessness: "scale_zero",
            wanting_to_avoid_people: "scale_zero"
          }
        ],
        from: null
      },
      subformName: "Felt Stigma",
      commonProps: {
        date: "2020-12-03T21:11:01Z",
        user: "primero"
      }
    };

    const result = [
      {
        key: "subfom-log-12340001",
        date: "2020-12-03T21:11:01Z",
        user: "primero",
        title: "change_logs.add_subform",
        details: [
          {
            from: "--",
            name: "feeling_detached",
            to: "scale_one"
          },
          {
            from: "--",
            name: "felt_stigma_score",
            to: 1
          },
          {
            from: "--",
            name: "feeling_badly_treated",
            to: "scale_zero"
          },
          {
            from: "--",
            name: "feelings_worthlessness",
            to: "scale_zero"
          },
          {
            from: "--",
            name: "wanting_to_avoid_people",
            to: "scale_zero"
          }
        ]
      }
    ];

    it("should return an array of object with logs ready to be render", () => {
      stub(Math, "random").returns(1234);
      expect(buildSubformDataItems(recordChanges, allFields, allAgencies, lookups, locations, i18n)).to.deep.equal(
        result
      );
    });
  });

  afterEach(() => {
    if (Math.random.restore) {
      Math.random.restore();
    }
  });
});
