import {
  MODULES,
  MRM_INSIGHTS_SUBREPORTS,
  GBV_INSIGHTS_SUBREPORTS,
  LOOKUPS,
  GHN_REPORT_SUBREPORTS,
  INDIVIDUAL_CHILDREN,
  WORKFLOW_SUBREPORTS,
  VIOLENCE_TYPE_SUBREPORTS
} from "../../config/constants";
import { DATE_FIELD, SELECT_FIELD, HIDDEN_FIELD, OPTION_TYPES } from "../form";
import { FieldRecord } from "../form/records";

const DATE_RANGE_OPTIONS = "date_range_options";
const VIEW_BY = "view_by";
const FIELDS = "fields";
const FROM = "from";
const TO = "to";
const DATE = "date";
const FILTER_BY = "filter_by";
const FILTER_OPTIONS = "filter_options";
const DATE_OF_FIRST_REPORT = "date_of_first_report";
const BY_OPTIONS = "by_options";

const CTFMR_VERIFIED_DATE = "ctfmr_verified_date";
const VERIFIED_CTFMR_TECHNICAL = "ctfmr_verified";
const INCIDENT_DATE = "incident_date";
const DATE_OF_REPORT = "date_of_report";
const VERIFIED = "verified";
const VERIFICATION_STATUS = "verification_status";
const GHN_DATE_FILTER = "ghn_date_filter";
const VIOLATION_TYPE = "violation_type";
const REGISTRATION_DATE = "registration_date";

const GBV_STATISTICS = "gbv_statistics";
const VIOLATIONS = "violations";

export const REPORTS = "reports";
export const DATE_RANGE = "date_range";
export const GROUPED_BY = "grouped_by";
export const QUARTER = "quarter";
export const MONTH = "month";
export const WEEK = "week";
export const YEAR = "year";
export const NAME = "Insights";
export const NAMESPACE = "insights";
export const DELETE_MODAL = "DeleteReportModal";
export const DATE_PATTERN = "(\\w{2}-)?\\w{3}-\\d{4}";
export const TOTAL = "total";
export const VIOLATION = "violation";
export const TOTAL_KEY = "_total";
export const MANAGED_REPORTS = "managed_reports";
export const STATUS = "status";
export const CREATED_BY_GROUPS = "created_by_groups";
export const OWNED_BY_GROUPS = "owned_by_groups";
export const CREATED_ORGANIZATION = "created_organization";
export const OWNED_BY_AGENCY_ID = "owned_by_agency_id";
export const USER_GROUP = "user_group";
export const AGENCY = "agency";
export const BY = "by";
export const WORKFLOW = "workflow";
export const VIOLENCE_TYPE = "cp_incident_violence_type";

export const DATE_CONTROLS = [TO, FROM, GROUPED_BY, DATE_RANGE];
export const DATE_CONTROLS_GROUP = DATE;
export const CONTROLS_GROUP = "default";

export const THIS_QUARTER = "this_quarter";
export const LAST_QUARTER = "last_quarter";
export const THIS_YEAR = "this_year";
export const LAST_YEAR = "last_year";
export const THIS_MONTH = "this_month";
export const LAST_MONTH = "last_month";
export const THIS_WEEK = "this_week";
export const LAST_WEEK = "last_week";
export const CUSTOM = "custom";

export const STATUS_CLOSED = "closed";
export const STATUS_OPEN = "open";

export const QUARTER_OPTION_IDS = [THIS_QUARTER, LAST_QUARTER, CUSTOM];
export const MONTH_OPTION_IDS = [THIS_MONTH, LAST_MONTH, CUSTOM];
export const YEAR_OPTION_IDS = [THIS_YEAR, LAST_YEAR, CUSTOM];
export const WEEK_OPTION_IDS = [THIS_WEEK, LAST_WEEK, CUSTOM];

export const EXPORT_INSIGHTS_PATH = "/managed_reports/export";
export const INSIGHTS_EXPORTER_DIALOG = "insights_exporter_dialog";

export const DATE_RANGE_VIEW_BY_DISPLAY_NAME = [FIELDS, DATE_RANGE, VIEW_BY];
export const DATE_RANGE_DISPLAY_NAME = [FIELDS, DATE_RANGE, DATE_RANGE];
export const DATE_RANGE_FROM_DISPLAY_NAME = [FIELDS, DATE_RANGE, FROM];
export const DATE_RANGE_TO_DISPLAY_NAME = [FIELDS, DATE_RANGE, TO];
export const FILTER_BY_DATE_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, DATE];
export const FILTER_BY_VERIFICATION_STATUS_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, VERIFICATION_STATUS];
export const FILTER_BY_VIOLATION_TYPE_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, VIOLATION_TYPE];
export const STATUS_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, STATUS];
export const CREATED_BY_GROUPS_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, CREATED_BY_GROUPS];
export const OWNED_BY_GROUPS_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, OWNED_BY_GROUPS];
export const BY_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, BY];
export const USER_GROUP_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, USER_GROUP];
export const AGENCY_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, AGENCY];
export const WORKFLOW_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, WORKFLOW];
export const VIOLENCE_TYPE_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, VIOLENCE_TYPE];

export const SHARED_FILTERS = [
  {
    name: GROUPED_BY,
    display_name: DATE_RANGE_VIEW_BY_DISPLAY_NAME,
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
    display_name: DATE_RANGE_DISPLAY_NAME,
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
    watchedInputs: GROUPED_BY,
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
    display_name: DATE_RANGE_FROM_DISPLAY_NAME,
    type: DATE_FIELD,
    watchedInputs: DATE_RANGE,
    showIf: value => value === CUSTOM
  },
  {
    name: TO,
    display_name: DATE_RANGE_TO_DISPLAY_NAME,
    type: DATE_FIELD,
    watchedInputs: DATE_RANGE,
    showIf: value => value === CUSTOM
  }
];

export const TSFV_FILTERS = {
  [GROUPED_BY]: {
    name: GROUPED_BY,
    display_name: DATE_RANGE_VIEW_BY_DISPLAY_NAME,
    clearDependentValues: [DATE_RANGE],
    option_strings_text: [
      { id: QUARTER, display_name: [MANAGED_REPORTS, DATE_RANGE, QUARTER] },
      { id: MONTH, display_name: [MANAGED_REPORTS, DATE_RANGE, MONTH] },
      { id: WEEK, display_name: [MANAGED_REPORTS, DATE_RANGE, WEEK] },
      { id: YEAR, display_name: [MANAGED_REPORTS, DATE_RANGE, YEAR] }
    ],
    type: SELECT_FIELD
  },
  [DATE_RANGE]: {
    name: DATE_RANGE,
    display_name: DATE_RANGE_DISPLAY_NAME,
    option_strings_text: [
      { id: THIS_QUARTER, display_name: [MANAGED_REPORTS, DATE_RANGE_OPTIONS, THIS_QUARTER] },
      { id: LAST_QUARTER, display_name: [MANAGED_REPORTS, DATE_RANGE_OPTIONS, LAST_QUARTER] },
      { id: THIS_MONTH, display_name: [MANAGED_REPORTS, DATE_RANGE_OPTIONS, THIS_MONTH] },
      { id: LAST_MONTH, display_name: [MANAGED_REPORTS, DATE_RANGE_OPTIONS, LAST_MONTH] },
      { id: THIS_WEEK, display_name: [MANAGED_REPORTS, DATE_RANGE_OPTIONS, THIS_WEEK] },
      { id: LAST_WEEK, display_name: [MANAGED_REPORTS, DATE_RANGE_OPTIONS, LAST_WEEK] },
      { id: THIS_YEAR, display_name: [MANAGED_REPORTS, DATE_RANGE_OPTIONS, THIS_YEAR] },
      { id: LAST_YEAR, display_name: [MANAGED_REPORTS, DATE_RANGE_OPTIONS, LAST_YEAR] },
      { id: CUSTOM, display_name: [MANAGED_REPORTS, DATE_RANGE_OPTIONS, CUSTOM] }
    ],
    type: SELECT_FIELD,
    watchedInputs: GROUPED_BY,
    filterOptionSource: (watchedInputsValue, options) => {
      const filterBy = () => {
        switch (watchedInputsValue) {
          case QUARTER:
            return QUARTER_OPTION_IDS;
          case MONTH:
            return MONTH_OPTION_IDS;
          case WEEK:
            return WEEK_OPTION_IDS;
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
  [FROM]: {
    name: FROM,
    display_name: DATE_RANGE_FROM_DISPLAY_NAME,
    type: DATE_FIELD,
    watchedInputs: DATE_RANGE,
    showIf: value => value === CUSTOM
  },
  [TO]: {
    name: TO,
    display_name: DATE_RANGE_TO_DISPLAY_NAME,
    type: DATE_FIELD,
    watchedInputs: DATE_RANGE,
    showIf: value => value === CUSTOM
  },
  [STATUS]: {
    name: STATUS,
    type: SELECT_FIELD,
    display_name: STATUS_DISPLAY_NAME,
    multi_select: true,
    option_strings_source: "lookup lookup-case-status",
    filterOptionSource: (_, options) => {
      return options.filter(option => [STATUS_CLOSED, STATUS_OPEN].includes(option.id));
    }
  },
  [BY]: {
    name: BY,
    type: SELECT_FIELD,
    display_name: BY_DISPLAY_NAME,
    option_strings_text: [
      { id: OWNED_BY_GROUPS, display_name: [MANAGED_REPORTS, BY_OPTIONS, OWNED_BY_GROUPS] },
      { id: CREATED_BY_GROUPS, display_name: [MANAGED_REPORTS, BY_OPTIONS, CREATED_BY_GROUPS] },
      { id: OWNED_BY_AGENCY_ID, display_name: [MANAGED_REPORTS, BY_OPTIONS, OWNED_BY_AGENCY_ID] },
      { id: CREATED_ORGANIZATION, display_name: [MANAGED_REPORTS, BY_OPTIONS, CREATED_ORGANIZATION] }
    ]
  },
  [CREATED_BY_GROUPS]: {
    name: CREATED_BY_GROUPS,
    type: SELECT_FIELD,
    display_name: USER_GROUP_DISPLAY_NAME,
    option_strings_source: OPTION_TYPES.USER_GROUP_PERMITTED,
    watchedInputs: [BY],
    showIf: values => values[BY] === CREATED_BY_GROUPS
  },
  [OWNED_BY_GROUPS]: {
    name: OWNED_BY_GROUPS,
    type: SELECT_FIELD,
    display_name: USER_GROUP_DISPLAY_NAME,
    option_strings_source: OPTION_TYPES.USER_GROUP_PERMITTED,
    watchedInputs: [BY],
    showIf: values => values[BY] === OWNED_BY_GROUPS
  },
  [CREATED_ORGANIZATION]: {
    name: CREATED_ORGANIZATION,
    type: SELECT_FIELD,
    display_name: AGENCY_DISPLAY_NAME,
    option_strings_source: OPTION_TYPES.AGENCY,
    watchedInputs: [BY],
    option_strings_source_id_key: "unique_id",
    showIf: values => values[BY] === CREATED_ORGANIZATION
  },
  [OWNED_BY_AGENCY_ID]: {
    name: OWNED_BY_AGENCY_ID,
    type: SELECT_FIELD,
    display_name: AGENCY_DISPLAY_NAME,
    option_strings_source: OPTION_TYPES.AGENCY,
    watchedInputs: [BY],
    option_strings_source_id_key: "unique_id",
    showIf: values => values[BY] === OWNED_BY_AGENCY_ID
  },
  [DATE]: {
    name: DATE,
    type: HIDDEN_FIELD
  }
};

export const VIOLATIONS_FILTERS = [
  ...SHARED_FILTERS,
  {
    name: DATE,
    display_name: FILTER_BY_DATE_DISPLAY_NAME,
    option_strings_text: [
      { id: INCIDENT_DATE, display_name: [MANAGED_REPORTS, VIOLATIONS, FILTER_OPTIONS, INCIDENT_DATE] },
      { id: DATE_OF_FIRST_REPORT, display_name: [MANAGED_REPORTS, VIOLATIONS, FILTER_OPTIONS, DATE_OF_REPORT] },
      {
        id: CTFMR_VERIFIED_DATE,
        display_name: [MANAGED_REPORTS, VIOLATIONS, FILTER_OPTIONS, CTFMR_VERIFIED_DATE]
      }
    ],
    type: SELECT_FIELD
  },
  {
    name: VERIFIED_CTFMR_TECHNICAL,
    display_name: FILTER_BY_VERIFICATION_STATUS_DISPLAY_NAME,
    option_strings_source: LOOKUPS.verification_status,
    type: SELECT_FIELD
  }
];

export const DEFAULT_VIOLATION_FILTERS = {
  [GROUPED_BY]: QUARTER,
  [DATE_RANGE]: THIS_QUARTER,
  [DATE]: INCIDENT_DATE,
  [VERIFIED_CTFMR_TECHNICAL]: VERIFIED
};

export const INSIGHTS_CONFIG = {
  [MODULES.MRM]: {
    violations: {
      ids: MRM_INSIGHTS_SUBREPORTS,
      localeKeys: [MANAGED_REPORTS, VIOLATIONS, REPORTS],
      defaultFilterValues: DEFAULT_VIOLATION_FILTERS,
      filters: VIOLATIONS_FILTERS.map(filter => FieldRecord(filter))
    },
    ghn_report: {
      ids: GHN_REPORT_SUBREPORTS,
      localeKeys: [MANAGED_REPORTS, GHN_REPORT_SUBREPORTS, REPORTS],
      filters: [
        ...SHARED_FILTERS,
        {
          name: DATE,
          type: HIDDEN_FIELD
        }
      ].map(filter => FieldRecord(filter)),
      defaultFilterValues: {
        [GROUPED_BY]: QUARTER,
        [DATE_RANGE]: LAST_QUARTER,
        [DATE]: GHN_DATE_FILTER
      }
    },
    individual_children: {
      ids: INDIVIDUAL_CHILDREN,
      localeKeys: [MANAGED_REPORTS, INDIVIDUAL_CHILDREN, REPORTS],
      defaultFilterValues: DEFAULT_VIOLATION_FILTERS,
      filters: [
        ...VIOLATIONS_FILTERS,
        {
          name: VIOLATION_TYPE,
          display_name: FILTER_BY_VIOLATION_TYPE_DISPLAY_NAME,
          option_strings_source: LOOKUPS.violation_type,
          multi_select: true,
          type: SELECT_FIELD
        }
      ].map(filter => FieldRecord(filter))
    }
  },
  [MODULES.GBV]: {
    gbv_statistics: {
      ids: GBV_INSIGHTS_SUBREPORTS,
      localeKeys: [MANAGED_REPORTS, GBV_STATISTICS, REPORTS],
      defaultFilterValues: {
        [GROUPED_BY]: MONTH,
        [DATE_RANGE]: LAST_MONTH,
        [DATE]: INCIDENT_DATE
      },
      filters: [
        ...SHARED_FILTERS,
        {
          name: DATE,
          display_name: FILTER_BY_DATE_DISPLAY_NAME,
          option_strings_text: [
            {
              id: DATE_OF_FIRST_REPORT,
              display_name: [MANAGED_REPORTS, GBV_STATISTICS, FILTER_OPTIONS, DATE_OF_FIRST_REPORT]
            },
            { id: INCIDENT_DATE, display_name: [MANAGED_REPORTS, GBV_STATISTICS, FILTER_OPTIONS, INCIDENT_DATE] }
          ],
          watchedInputs: GROUPED_BY,
          type: SELECT_FIELD,
          handleWatchedInputs: value => ({
            disabled: !value
          })
        }
      ].map(filter => FieldRecord(filter))
    }
  },
  [MODULES.CP]: {
    workflow_report: {
      ids: WORKFLOW_SUBREPORTS,
      defaultFilterValues: {
        [GROUPED_BY]: WEEK,
        [DATE_RANGE]: LAST_WEEK,
        [STATUS]: [STATUS_OPEN],
        [DATE]: REGISTRATION_DATE,
        [BY]: OWNED_BY_GROUPS
      },
      filters: [
        TSFV_FILTERS[GROUPED_BY],
        TSFV_FILTERS[DATE_RANGE],
        TSFV_FILTERS[FROM],
        TSFV_FILTERS[TO],
        TSFV_FILTERS[STATUS],
        {
          name: WORKFLOW,
          type: SELECT_FIELD,
          display_name: WORKFLOW_DISPLAY_NAME
        },
        TSFV_FILTERS[BY],
        TSFV_FILTERS[CREATED_BY_GROUPS],
        TSFV_FILTERS[OWNED_BY_GROUPS],
        TSFV_FILTERS[CREATED_ORGANIZATION],
        TSFV_FILTERS[OWNED_BY_AGENCY_ID],
        TSFV_FILTERS[DATE]
      ].map(filter => FieldRecord(filter))
    },
    violence_type_report: {
      ids: VIOLENCE_TYPE_SUBREPORTS,
      defaultFilterValues: {
        [GROUPED_BY]: WEEK,
        [DATE_RANGE]: LAST_WEEK,
        [STATUS]: [STATUS_OPEN],
        [DATE]: REGISTRATION_DATE,
        [BY]: OWNED_BY_GROUPS
      },
      filters: [
        TSFV_FILTERS[GROUPED_BY],
        TSFV_FILTERS[DATE_RANGE],
        TSFV_FILTERS[FROM],
        TSFV_FILTERS[TO],
        TSFV_FILTERS[STATUS],
        {
          name: VIOLENCE_TYPE,
          type: SELECT_FIELD,
          display_name: VIOLENCE_TYPE_DISPLAY_NAME,
          option_strings_source: "lookup lookup-gbv-sexual-violence-type"
        },
        TSFV_FILTERS[BY],
        TSFV_FILTERS[CREATED_BY_GROUPS],
        TSFV_FILTERS[OWNED_BY_GROUPS],
        TSFV_FILTERS[CREATED_ORGANIZATION],
        TSFV_FILTERS[OWNED_BY_AGENCY_ID],
        TSFV_FILTERS[DATE]
      ].map(filter => FieldRecord(filter))
    }
  }
};
