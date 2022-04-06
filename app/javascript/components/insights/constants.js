import { MODULES, MRM_INSIGHTS_SUBREPORTS, GBV_INSIGHTS_SUBREPORTS, LOOKUPS } from "../../config/constants";
import { DATE_FIELD, FieldRecord, SELECT_FIELD } from "../form";

const DATE_RANGE_OPTIONS = "date_range_options";
const VIEW_BY = "view_by";
const DATE_RANGE = "date_range";
const FIELDS = "fields";
const QUARTER = "quarter";
const MONTH = "month";
const YEAR = "year";
const FROM = "from";
const TO = "to";
const DATE = "date";
const FILTER_BY = "filter_by";
const FILTER_OPTIONS = "filter_options";
const REPORTS = "reports";
const DATE_OF_FIRST_REPORT = "date_of_first_report";

const CTFMR_VERIFIED_DATE = "ctfmr_verified_date";
const VERIFIED_CTFMR_TECHNICAL = "verified_ctfmr_technical";
const INCIDENT_DATE = "incident_date";
const DATE_OF_REPORT = "date_of_report";
const VERIFIED = "verified";
const VERIFICATION_STATUS = "verification_status";

const GBV_STATISTICS = "gbv_statistics";
const VIOLATIONS = "violations";

export const NAME = "Insights";
export const NAMESPACE = "insights";
export const DELETE_MODAL = "DeleteReportModal";
export const DATE_PATTERN = "(\\w{2}-)?\\w{3}-\\d{4}";
export const TOTAL = "total";
export const VIOLATION = "violation";
export const TOTAL_KEY = "_total";
export const MANAGED_REPORTS = "managed_reports";

export const DATE_CONTROLS = [TO, FROM, VIEW_BY, DATE_RANGE];
export const DATE_CONTROLS_GROUP = DATE;
export const CONTROLS_GROUP = "default";

export const THIS_QUARTER = "this_quarter";
export const LAST_QUARTER = "last_quarter";
export const THIS_YEAR = "this_year";
export const LAST_YEAR = "last_year";
export const THIS_MONTH = "this_month";
export const LAST_MONTH = "last_month";
export const CUSTOM = "custom";

export const QUARTER_OPTION_IDS = [THIS_QUARTER, LAST_QUARTER, CUSTOM];
export const MONTH_OPTION_IDS = [THIS_MONTH, LAST_MONTH, CUSTOM];
export const YEAR_OPTION_IDS = [THIS_YEAR, LAST_YEAR, CUSTOM];

export const EXPORT_INSIGHTS_PATH = "/managed_reports/export";
export const INSIGHTS_EXPORTER_DIALOG = "insights_exporter_dialog";

export const SHARED_FILTERS = [
  {
    name: VIEW_BY,
    display_name: [FIELDS, DATE_RANGE, VIEW_BY],
    clearDependentValues: [DATE_RANGE],
    option_strings_text: [
      { id: QUARTER, display_name: [MANAGED_REPORTS, DATE_RANGE, QUARTER] },
      { id: MONTH, display_name: [MANAGED_REPORTS, DATE_RANGE, MONTH] },
      { id: YEAR, display_name: [MANAGED_REPORTS, DATE_RANGE, YEAR] }
    ],
    type: SELECT_FIELD
  },
  {
    name: DATE_RANGE,
    display_name: [FIELDS, DATE_RANGE, DATE_RANGE],
    option_strings_text: [
      { id: THIS_QUARTER, display_name: [MANAGED_REPORTS, DATE_RANGE_OPTIONS, THIS_QUARTER] },
      { id: LAST_QUARTER, display_name: [MANAGED_REPORTS, DATE_RANGE_OPTIONS, LAST_QUARTER] },
      { id: THIS_MONTH, display_name: [MANAGED_REPORTS, DATE_RANGE_OPTIONS, THIS_MONTH] },
      { id: LAST_MONTH, display_name: [MANAGED_REPORTS, DATE_RANGE_OPTIONS, LAST_MONTH] },
      { id: THIS_YEAR, display_name: [MANAGED_REPORTS, DATE_RANGE_OPTIONS, THIS_YEAR] },
      { id: LAST_YEAR, display_name: [MANAGED_REPORTS, DATE_RANGE_OPTIONS, LAST_YEAR] },
      { id: CUSTOM, display_name: [MANAGED_REPORTS, DATE_RANGE_OPTIONS, CUSTOM] }
    ],
    type: SELECT_FIELD,
    watchedInputs: VIEW_BY,
    filterOptionSource: (watchedInputsValue, options) => {
      const filterBy = () => {
        switch (watchedInputsValue) {
          case QUARTER:
            return QUARTER_OPTION_IDS;
          case MONTH:
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
    name: FROM,
    display_name: [FIELDS, DATE_RANGE, FROM],
    type: DATE_FIELD,
    watchedInputs: DATE_RANGE,
    showIf: value => value
  },
  {
    name: TO,
    display_name: [FIELDS, DATE_RANGE, TO],
    type: DATE_FIELD,
    watchedInputs: DATE_RANGE,
    showIf: value => value
  }
];

export const INSIGHTS_CONFIG = {
  [MODULES.MRM]: {
    ids: MRM_INSIGHTS_SUBREPORTS,
    localeKeys: [MANAGED_REPORTS, VIOLATIONS, REPORTS],
    defaultFilterValues: {
      [VIEW_BY]: QUARTER,
      [DATE_RANGE]: THIS_QUARTER,
      [DATE]: INCIDENT_DATE,
      [VERIFIED_CTFMR_TECHNICAL]: VERIFIED
    },
    filters: [
      ...SHARED_FILTERS,
      {
        name: DATE,
        display_name: [MANAGED_REPORTS, FILTER_BY, DATE],
        option_strings_text: [
          { id: INCIDENT_DATE, display_name: [MANAGED_REPORTS, VIOLATIONS, FILTER_OPTIONS, INCIDENT_DATE] },
          { id: DATE_OF_REPORT, display_name: [MANAGED_REPORTS, VIOLATIONS, FILTER_OPTIONS, DATE_OF_REPORT] },
          {
            id: CTFMR_VERIFIED_DATE,
            display_name: [MANAGED_REPORTS, VIOLATIONS, FILTER_OPTIONS, CTFMR_VERIFIED_DATE]
          }
        ],
        type: SELECT_FIELD
      },
      {
        name: VERIFIED_CTFMR_TECHNICAL,
        display_name: [MANAGED_REPORTS, FILTER_BY, VERIFICATION_STATUS],
        option_strings_source: LOOKUPS.verification_status,
        type: SELECT_FIELD
      }
    ].map(filter => FieldRecord(filter))
  },
  [MODULES.GBV]: {
    ids: GBV_INSIGHTS_SUBREPORTS,
    localeKeys: [MANAGED_REPORTS, GBV_STATISTICS, REPORTS],
    filters: [
      ...SHARED_FILTERS,
      {
        name: DATE,
        display_name: [MANAGED_REPORTS, FILTER_BY, DATE],
        option_strings_text: [
          {
            id: DATE_OF_FIRST_REPORT,
            display_name: [MANAGED_REPORTS, GBV_STATISTICS, FILTER_OPTIONS, DATE_OF_FIRST_REPORT]
          },
          { id: INCIDENT_DATE, display_name: [MANAGED_REPORTS, GBV_STATISTICS, FILTER_OPTIONS, INCIDENT_DATE] }
        ],
        watchedInputs: VIEW_BY,
        type: SELECT_FIELD,
        handleWatchedInputs: value => ({
          disabled: !value
        })
      }
    ].map(filter => FieldRecord(filter))
  }
};
