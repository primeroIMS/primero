import { VIOLATIONS_SUBFORM_UNIQUE_IDS } from "../../config/constants";
import { DATE_FIELD, FieldRecord, SELECT_FIELD } from "../form";

const QUARTER_OPTION_IDS = ["this_quarter", "last_quarter", "custom"];
const MONTH_OPTION_IDS = ["this_month", "last_month", "custom"];
const YEAR_OPTION_IDS = ["this_year", "last_year", "custom"];

export const NAME = "Insights";
export const DELETE_MODAL = "DeleteReportModal";
export const DATE_PATTERN = "(\\w{2}-)?\\w{3}-\\d{4}";
export const TOTAL = "Total";
export const TOTAL_KEY = "_total";

export const DATE_CONTROLS = ["to", "from", "view_by", "date_range"];
export const DATE_CONTROLS_GROUP = "date";
export const CONTROLS_GROUP = "default";

export const THIS_QUARTER = "this_quarter";
export const LAST_QUARTER = "last_quarter";
export const THIS_YEAR = "this_year";
export const LAST_YEAR = "last_year";
export const THIS_MONTH = "this_month";
export const LAST_MONTH = "last_month";
export const CUSTOM = "custom";

export const INSIGHTS_CONFIG = {
  mrm: {
    ids: VIOLATIONS_SUBFORM_UNIQUE_IDS,
    localeKeys: ["incident", "violation", "types"],
    filters: [
      {
        name: "view_by",
        display_name: ["fields", "date_range", "view_by"],
        clearDependentValues: ["date_range"],
        option_strings_text: [
          { id: "quarter", display_name: ["report", "date_ranges", "quarter"] },
          { id: "month", display_name: ["report", "date_ranges", "month"] },
          { id: "year", display_name: ["report", "date_ranges", "year"] }
        ],
        type: SELECT_FIELD
      },
      {
        name: "date_range",
        display_name: ["fields", "date_range", "date_range"],
        option_strings_text: [
          { id: THIS_QUARTER, display_name: ["insights", "date_range_options", "this_quarter"] },
          { id: LAST_QUARTER, display_name: ["insights", "date_range_options", "last_quarter"] },
          { id: THIS_MONTH, display_name: ["insights", "date_range_options", "this_month"] },
          { id: LAST_MONTH, display_name: ["insights", "date_range_options", "last_month"] },
          { id: THIS_YEAR, display_name: ["insights", "date_range_options", "this_year"] },
          { id: LAST_YEAR, display_name: ["insights", "date_range_options", "last_year"] },
          { id: CUSTOM, display_name: ["insights", "date_range_options", "custom"] }
        ],
        type: SELECT_FIELD,
        watchedInputs: "view_by",
        filterOptionSource: (watchedInputsValue, options) => {
          const filterBy = () => {
            switch (watchedInputsValue) {
              case "quarter":
                return QUARTER_OPTION_IDS;
              case "month":
                return MONTH_OPTION_IDS;
              default:
                return YEAR_OPTION_IDS;
            }
          };

          return options.filter(option => filterBy().includes(option.id));
        },
        handleWatchedInputs: value => ({
          disabled: !value
        })
      },
      {
        name: "from",
        display_name: ["fields", "date_range", "from"],
        type: DATE_FIELD,
        watchedInputs: "date_range",
        handleWatchedInputs: value => ({
          disabled: value !== "custom"
        })
      },
      {
        name: "to",
        display_name: ["fields", "date_range", "to"],
        type: DATE_FIELD,
        watchedInputs: "date_range",
        handleWatchedInputs: value => ({
          disabled: value !== "custom"
        })
      },
      {
        name: "date",
        display_name: ["cases", "filter_by", "date"],
        option_strings_text: [
          { id: "date_of_incident", display_name: ["insights", "mrm", "date_of_incident"] },
          { id: "date_of_report", display_name: ["insights", "mrm", "date_of_report"] },
          { id: "date_of_verification", display_name: ["insights", "mrm", "date_of_verification"] }
        ],
        type: SELECT_FIELD
      },
      {
        name: "verification_status",
        display_name: ["incidents", "filter_by", "verification_status"],
        option_strings_source: "lookup lookup-verification-status",
        type: SELECT_FIELD
      }
    ].map(filter => FieldRecord(filter))
  },
  gbv: {}
};
