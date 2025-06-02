// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import {
  MRM_INSIGHTS_SUBREPORTS,
  GBV_INSIGHTS_SUBREPORTS,
  LOOKUPS,
  GHN_REPORT_SUBREPORTS,
  INDIVIDUAL_CHILDREN,
  WORKFLOW_SUBREPORTS,
  VIOLENCE_TYPE_SUBREPORTS,
  REFERRAL_TRANSFERS_SUBREPORTS,
  INPROGRESS,
  ACCEPTED,
  REJECTED,
  DONE,
  PROTECTION_CONCERNS_SUBREPORTS,
  REPORTING_LOCATIONS_SUBREPORTS,
  FOLLOWUPS_SUBREPORTS,
  SERVICES_SUBREPORTS,
  CASES_WORKFLOW_SUBREPORTS,
  PROTECTION_OUTCOMES_SUBREPORTS,
  PROCESS_QUALITY_TOTAL_CASES_SUBREPORTS,
  PROCESS_QUALITY_AVERAGE_CASES_SUBREPORTS,
  PROCESS_QUALITY_SUCCESSFUL_REFERRALS_SUBREPORTS,
  PROCESS_QUALITY_IMPLEMENTED_REFERRALS_SUBREPORTS,
  CASE_CHARACTERISTICS_SUBREPORTS
} from "../../config";
import { DATE_FIELD, SELECT_FIELD, HIDDEN_FIELD, OPTION_TYPES } from "../form/constants";
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
const DATE_CLOSURE = "date_closure";
const BY_OPTIONS = "by_options";
const REFERRAL_TRANSFER_STATUS_OPTIONS = "referral_transfer_status_options";
const MODULE = "module_id";

const CTFMR_VERIFIED_DATE = "ctfmr_verified_date";
const VERIFIED_CTFMR_TECHNICAL = "ctfmr_verified";
const INCIDENT_DATE = "incident_date";
const DATE_OF_REPORT = "date_of_report";
const VERIFIED = "verified";
const VERIFICATION_STATUS = "verification_status";
const GHN_DATE_FILTER = "ghn_date_filter";
const VIOLATION_TYPE = "violation_type";
const REGISTRATION_DATE = "registration_date";
const SERVICE_IMPLEMENTED_DAY_TIME = "service_implemented_day_time";
const SERVICE_RESPONSE_DAY_TIME = "service_response_day_time";
const CREATED_AT = "created_at";
const FOLLOWUP_DATE = "followup_date";
const REFERRAL_CREATED_AT = "referral_created_at";
const CASE_STATUS = "case_status";

const GBV_STATISTICS = "gbv_statistics";
const VIOLATIONS = "violations";
const PROTECTION_OUTCOMES = "protection_outcomes";
const PROCESS_QUALITY_TOTAL_CASES = "process_quality_total_cases";
const PROCESS_QUALITY_AVERAGE_CASES = "process_quality_average_cases";
const PROCESS_QUALITY_SUCCESSFUL_REFERRALS = "process_quality_successful_referrals";
const PROCESS_QUALITY_IMPLEMENTED_REFERRALS = "process_quality_implemented_referrals";
const CASE_CHARACTERISTICS = "case_characteristics";

export const MODULE_ID = "module_id";
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
export const PROTECTION_CONCERNS = "protection_concerns";
export const REPORTING_LOCATIONS = "location";
export const FOLLOWUPS = "followup_type";
export const SERVICES = "service_type";
export const VIOLENCE_TYPE = "cp_incident_violence_type";
export const REFERRAL_TRANSFER_STATUS = "referral_transfer_status";

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

export const MODULE_ID_NAME = [MANAGED_REPORTS, FILTER_BY, MODULE_ID];
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
export const PROTECTION_CONCERNS_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, PROTECTION_CONCERNS];
export const REPORTING_LOCATIONS_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, REPORTING_LOCATIONS];
export const FOLLOWUPS_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, FOLLOWUPS];
export const SERVICES_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, SERVICES];
export const VIOLENCE_TYPE_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, VIOLENCE_TYPE];
export const REFERRAL_TRANSFER_STATUS_DISPLAY_NAME = [MANAGED_REPORTS, FILTER_BY, REFERRAL_TRANSFER_STATUS];

export const SHARED_FILTERS = {
  [GROUPED_BY]: {
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
  [DATE_RANGE]: {
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
  [MODULE]: {
    name: MODULE,
    type: SELECT_FIELD,
    display_name: MODULE_ID_NAME,
    option_strings_source: OPTION_TYPES.MODULE
  }
};

export const RECORD_FILTERS = {
  ...SHARED_FILTERS,
  [GROUPED_BY]: {
    ...SHARED_FILTERS[GROUPED_BY],
    option_strings_text: [
      { id: QUARTER, display_name: [MANAGED_REPORTS, DATE_RANGE, QUARTER] },
      { id: MONTH, display_name: [MANAGED_REPORTS, DATE_RANGE, MONTH] },
      { id: WEEK, display_name: [MANAGED_REPORTS, DATE_RANGE, WEEK] },
      { id: YEAR, display_name: [MANAGED_REPORTS, DATE_RANGE, YEAR] }
    ]
  },
  [DATE_RANGE]: {
    ...SHARED_FILTERS[DATE_RANGE],
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
    }
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
    option_strings_source: OPTION_TYPES.INSIGHTS_USER_GROUP_PERMITTED,
    watchedInputs: [BY],
    showIf: values => values[BY] === CREATED_BY_GROUPS
  },
  [OWNED_BY_GROUPS]: {
    name: OWNED_BY_GROUPS,
    type: SELECT_FIELD,
    display_name: USER_GROUP_DISPLAY_NAME,
    option_strings_source: OPTION_TYPES.INSIGHTS_USER_GROUP_PERMITTED,
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
  SHARED_FILTERS[GROUPED_BY],
  SHARED_FILTERS[DATE_RANGE],
  SHARED_FILTERS[FROM],
  SHARED_FILTERS[TO],
  SHARED_FILTERS[MODULE],
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

export const SHARED_WORKFLOW_CONFIG = {
  ids: WORKFLOW_SUBREPORTS,
  defaultFilterValues: {
    [GROUPED_BY]: WEEK,
    [DATE_RANGE]: LAST_WEEK,
    [STATUS]: [STATUS_OPEN],
    [DATE]: REGISTRATION_DATE,
    [BY]: OWNED_BY_GROUPS
  },
  filters: [
    RECORD_FILTERS[GROUPED_BY],
    RECORD_FILTERS[DATE_RANGE],
    RECORD_FILTERS[FROM],
    RECORD_FILTERS[TO],
    SHARED_FILTERS[MODULE],
    RECORD_FILTERS[STATUS],
    {
      name: WORKFLOW,
      type: SELECT_FIELD,
      display_name: WORKFLOW_DISPLAY_NAME,
      watchedInputs: [MODULE_ID],
      filterOptionSource: (watchedInputsValue, options) => {
        if (watchedInputsValue.module_id) {
          const selectedOptions = options.find(optionGroup => optionGroup[2] === watchedInputsValue.module_id);

          return selectedOptions?.[1]?.map(opt => ({ id: opt.id, display_text: opt.display_text.en }));
        }

        return [];
      }
    },
    RECORD_FILTERS[BY],
    RECORD_FILTERS[CREATED_BY_GROUPS],
    RECORD_FILTERS[OWNED_BY_GROUPS],
    RECORD_FILTERS[CREATED_ORGANIZATION],
    RECORD_FILTERS[OWNED_BY_AGENCY_ID],
    RECORD_FILTERS[DATE]
  ].map(filter => FieldRecord(filter))
};

export const INSIGHTS_CONFIG = {
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
      SHARED_FILTERS[GROUPED_BY],
      SHARED_FILTERS[DATE_RANGE],
      SHARED_FILTERS[FROM],
      SHARED_FILTERS[TO],
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
  },
  gbv_statistics: {
    ids: GBV_INSIGHTS_SUBREPORTS,
    localeKeys: [MANAGED_REPORTS, GBV_STATISTICS, REPORTS],
    defaultFilterValues: {
      [GROUPED_BY]: MONTH,
      [DATE_RANGE]: LAST_MONTH,
      [DATE]: INCIDENT_DATE
    },
    filters: [
      SHARED_FILTERS[GROUPED_BY],
      SHARED_FILTERS[DATE_RANGE],
      SHARED_FILTERS[FROM],
      SHARED_FILTERS[TO],
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
  },
  protection_concerns_report: {
    ids: PROTECTION_CONCERNS_SUBREPORTS,
    defaultFilterValues: {
      [GROUPED_BY]: WEEK,
      [DATE_RANGE]: LAST_WEEK,
      [STATUS]: [STATUS_OPEN],
      [DATE]: REGISTRATION_DATE,
      [BY]: OWNED_BY_GROUPS
    },
    filters: [
      RECORD_FILTERS[GROUPED_BY],
      RECORD_FILTERS[DATE_RANGE],
      RECORD_FILTERS[FROM],
      RECORD_FILTERS[TO],
      SHARED_FILTERS[MODULE],
      RECORD_FILTERS[STATUS],
      {
        name: PROTECTION_CONCERNS,
        type: SELECT_FIELD,
        display_name: PROTECTION_CONCERNS_DISPLAY_NAME,
        multi_select: true,
        option_strings_source: LOOKUPS.protection_concerns
      },
      RECORD_FILTERS[BY],
      RECORD_FILTERS[CREATED_BY_GROUPS],
      RECORD_FILTERS[OWNED_BY_GROUPS],
      RECORD_FILTERS[CREATED_ORGANIZATION],
      RECORD_FILTERS[OWNED_BY_AGENCY_ID],
      RECORD_FILTERS[DATE]
    ].map(filter => FieldRecord(filter))
  },
  reporting_locations_report: {
    ids: REPORTING_LOCATIONS_SUBREPORTS,
    defaultFilterValues: {
      [GROUPED_BY]: WEEK,
      [DATE_RANGE]: LAST_WEEK,
      [STATUS]: [STATUS_OPEN],
      [DATE]: REGISTRATION_DATE,
      [BY]: OWNED_BY_GROUPS
    },
    filters: [
      RECORD_FILTERS[GROUPED_BY],
      RECORD_FILTERS[DATE_RANGE],
      RECORD_FILTERS[FROM],
      RECORD_FILTERS[TO],
      SHARED_FILTERS[MODULE],
      RECORD_FILTERS[STATUS],
      {
        name: REPORTING_LOCATIONS,
        type: SELECT_FIELD,
        display_name: REPORTING_LOCATIONS_DISPLAY_NAME,
        option_strings_source: LOOKUPS.reporting_locations
      },
      RECORD_FILTERS[BY],
      RECORD_FILTERS[CREATED_BY_GROUPS],
      RECORD_FILTERS[OWNED_BY_GROUPS],
      RECORD_FILTERS[CREATED_ORGANIZATION],
      RECORD_FILTERS[OWNED_BY_AGENCY_ID],
      RECORD_FILTERS[DATE]
    ].map(filter => FieldRecord(filter))
  },
  followups_report: {
    ids: FOLLOWUPS_SUBREPORTS,
    defaultFilterValues: {
      [GROUPED_BY]: WEEK,
      [DATE_RANGE]: LAST_WEEK,
      [STATUS]: [STATUS_OPEN],
      [DATE]: FOLLOWUP_DATE,
      [BY]: OWNED_BY_GROUPS
    },
    filters: [
      RECORD_FILTERS[GROUPED_BY],
      RECORD_FILTERS[DATE_RANGE],
      RECORD_FILTERS[FROM],
      RECORD_FILTERS[TO],
      SHARED_FILTERS[MODULE],
      RECORD_FILTERS[STATUS],
      {
        name: FOLLOWUPS,
        type: SELECT_FIELD,
        display_name: FOLLOWUPS_DISPLAY_NAME,
        multi_select: true,
        option_strings_source: LOOKUPS.followup_type
      },
      RECORD_FILTERS[BY],
      RECORD_FILTERS[CREATED_BY_GROUPS],
      RECORD_FILTERS[OWNED_BY_GROUPS],
      RECORD_FILTERS[CREATED_ORGANIZATION],
      RECORD_FILTERS[OWNED_BY_AGENCY_ID],
      RECORD_FILTERS[DATE]
    ].map(filter => FieldRecord(filter))
  },
  services_report: {
    ids: SERVICES_SUBREPORTS,
    defaultFilterValues: {
      [GROUPED_BY]: WEEK,
      [DATE_RANGE]: LAST_WEEK,
      [STATUS]: [STATUS_OPEN],
      [DATE]: SERVICE_IMPLEMENTED_DAY_TIME,
      [BY]: OWNED_BY_GROUPS
    },
    filters: [
      RECORD_FILTERS[GROUPED_BY],
      RECORD_FILTERS[DATE_RANGE],
      RECORD_FILTERS[FROM],
      RECORD_FILTERS[TO],
      SHARED_FILTERS[MODULE],
      RECORD_FILTERS[STATUS],
      {
        name: SERVICES,
        type: SELECT_FIELD,
        display_name: SERVICES_DISPLAY_NAME,
        multi_select: true,
        option_strings_source: LOOKUPS.service_type
      },
      RECORD_FILTERS[BY],
      RECORD_FILTERS[CREATED_BY_GROUPS],
      RECORD_FILTERS[OWNED_BY_GROUPS],
      RECORD_FILTERS[CREATED_ORGANIZATION],
      RECORD_FILTERS[OWNED_BY_AGENCY_ID],
      RECORD_FILTERS[DATE]
    ].map(filter => FieldRecord(filter))
  },
  workflow_report: SHARED_WORKFLOW_CONFIG,
  cases_workflow_report: {
    ids: CASES_WORKFLOW_SUBREPORTS,
    ...SHARED_WORKFLOW_CONFIG
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
      RECORD_FILTERS[GROUPED_BY],
      RECORD_FILTERS[DATE_RANGE],
      RECORD_FILTERS[FROM],
      RECORD_FILTERS[TO],
      SHARED_FILTERS[MODULE],
      RECORD_FILTERS[STATUS],
      {
        name: VIOLENCE_TYPE,
        type: SELECT_FIELD,
        display_name: VIOLENCE_TYPE_DISPLAY_NAME,
        option_strings_source: "lookup lookup-gbv-sexual-violence-type"
      },
      RECORD_FILTERS[BY],
      RECORD_FILTERS[CREATED_BY_GROUPS],
      RECORD_FILTERS[OWNED_BY_GROUPS],
      RECORD_FILTERS[CREATED_ORGANIZATION],
      RECORD_FILTERS[OWNED_BY_AGENCY_ID],
      RECORD_FILTERS[DATE]
    ].map(filter => FieldRecord(filter))
  },
  referrals_transfers_report: {
    ids: REFERRAL_TRANSFERS_SUBREPORTS,
    defaultFilterValues: {
      [GROUPED_BY]: WEEK,
      [DATE_RANGE]: LAST_WEEK,
      [STATUS]: [STATUS_OPEN],
      [DATE]: CREATED_AT,
      [BY]: OWNED_BY_GROUPS,
      [REFERRAL_TRANSFER_STATUS]: [ACCEPTED]
    },
    filters: [
      RECORD_FILTERS[GROUPED_BY],
      RECORD_FILTERS[DATE_RANGE],
      RECORD_FILTERS[FROM],
      RECORD_FILTERS[TO],
      SHARED_FILTERS[MODULE],
      RECORD_FILTERS[STATUS],
      RECORD_FILTERS[BY],
      RECORD_FILTERS[CREATED_BY_GROUPS],
      RECORD_FILTERS[OWNED_BY_GROUPS],
      RECORD_FILTERS[CREATED_ORGANIZATION],
      RECORD_FILTERS[OWNED_BY_AGENCY_ID],
      {
        name: REFERRAL_TRANSFER_STATUS,
        type: SELECT_FIELD,
        display_name: REFERRAL_TRANSFER_STATUS_DISPLAY_NAME,
        multi_select: true,
        option_strings_text: [
          { id: INPROGRESS, display_name: [MANAGED_REPORTS, REFERRAL_TRANSFER_STATUS_OPTIONS, INPROGRESS] },
          { id: ACCEPTED, display_name: [MANAGED_REPORTS, REFERRAL_TRANSFER_STATUS_OPTIONS, ACCEPTED] },
          { id: REJECTED, display_name: [MANAGED_REPORTS, REFERRAL_TRANSFER_STATUS_OPTIONS, REJECTED] },
          { id: DONE, display_name: [MANAGED_REPORTS, REFERRAL_TRANSFER_STATUS_OPTIONS, DONE] }
        ]
      },
      RECORD_FILTERS[DATE]
    ].map(filter => FieldRecord(filter))
  },
  protection_outcomes: {
    ids: PROTECTION_OUTCOMES_SUBREPORTS,
    defaultFilterValues: {
      [GROUPED_BY]: MONTH,
      [DATE_RANGE]: LAST_MONTH,
      [STATUS]: [],
      [DATE]: REGISTRATION_DATE
    },
    filters: [
      RECORD_FILTERS[GROUPED_BY],
      RECORD_FILTERS[DATE_RANGE],
      RECORD_FILTERS[FROM],
      RECORD_FILTERS[TO],
      SHARED_FILTERS[MODULE],
      RECORD_FILTERS[STATUS],
      {
        name: DATE,
        display_name: FILTER_BY_DATE_DISPLAY_NAME,
        option_strings_text: [
          {
            id: REGISTRATION_DATE,
            display_name: [MANAGED_REPORTS, PROTECTION_OUTCOMES, FILTER_OPTIONS, REGISTRATION_DATE]
          },
          {
            id: DATE_CLOSURE,
            display_name: [MANAGED_REPORTS, PROTECTION_OUTCOMES, FILTER_OPTIONS, DATE_CLOSURE]
          }
        ],
        type: SELECT_FIELD
      }
    ].map(filter => FieldRecord(filter))
  },
  process_quality_total_cases: {
    ids: PROCESS_QUALITY_TOTAL_CASES_SUBREPORTS,
    defaultFilterValues: {
      [GROUPED_BY]: MONTH,
      [DATE_RANGE]: LAST_MONTH,
      [STATUS]: [],
      [DATE]: REGISTRATION_DATE
    },
    filters: [
      RECORD_FILTERS[GROUPED_BY],
      RECORD_FILTERS[DATE_RANGE],
      RECORD_FILTERS[FROM],
      RECORD_FILTERS[TO],
      SHARED_FILTERS[MODULE],
      RECORD_FILTERS[STATUS],
      {
        name: DATE,
        display_name: FILTER_BY_DATE_DISPLAY_NAME,
        option_strings_text: [
          {
            id: REGISTRATION_DATE,
            display_name: [MANAGED_REPORTS, PROCESS_QUALITY_TOTAL_CASES, FILTER_OPTIONS, REGISTRATION_DATE]
          },
          {
            id: DATE_CLOSURE,
            display_name: [MANAGED_REPORTS, PROCESS_QUALITY_TOTAL_CASES, FILTER_OPTIONS, DATE_CLOSURE]
          }
        ],
        type: SELECT_FIELD
      }
    ].map(filter => FieldRecord(filter))
  },
  process_quality_average_cases: {
    ids: PROCESS_QUALITY_AVERAGE_CASES_SUBREPORTS,
    defaultFilterValues: {
      [GROUPED_BY]: MONTH,
      [DATE_RANGE]: LAST_MONTH,
      [STATUS]: [STATUS_OPEN],
      [DATE]: REGISTRATION_DATE
    },
    filters: [
      RECORD_FILTERS[GROUPED_BY],
      RECORD_FILTERS[DATE_RANGE],
      RECORD_FILTERS[FROM],
      RECORD_FILTERS[TO],
      SHARED_FILTERS[MODULE],
      RECORD_FILTERS[STATUS],
      {
        name: DATE,
        display_name: FILTER_BY_DATE_DISPLAY_NAME,
        option_strings_text: [
          {
            id: REGISTRATION_DATE,
            display_name: [MANAGED_REPORTS, PROCESS_QUALITY_AVERAGE_CASES, FILTER_OPTIONS, REGISTRATION_DATE]
          },
          {
            id: DATE_CLOSURE,
            display_name: [MANAGED_REPORTS, PROCESS_QUALITY_AVERAGE_CASES, FILTER_OPTIONS, DATE_CLOSURE]
          }
        ],
        type: SELECT_FIELD
      }
    ].map(filter => FieldRecord(filter))
  },
  process_quality_successful_referrals: {
    ids: PROCESS_QUALITY_SUCCESSFUL_REFERRALS_SUBREPORTS,
    defaultFilterValues: {
      [GROUPED_BY]: MONTH,
      [DATE_RANGE]: LAST_MONTH,
      [STATUS]: [STATUS_OPEN],
      [DATE]: SERVICE_RESPONSE_DAY_TIME
    },
    filters: [
      RECORD_FILTERS[GROUPED_BY],
      RECORD_FILTERS[DATE_RANGE],
      RECORD_FILTERS[FROM],
      RECORD_FILTERS[TO],
      SHARED_FILTERS[MODULE],
      {
        ...RECORD_FILTERS[STATUS],
        display_name: [MANAGED_REPORTS, PROCESS_QUALITY_SUCCESSFUL_REFERRALS, FILTER_OPTIONS, CASE_STATUS]
      },
      {
        name: REPORTING_LOCATIONS,
        type: SELECT_FIELD,
        display_name: REPORTING_LOCATIONS_DISPLAY_NAME,
        option_strings_source: LOOKUPS.reporting_locations
      },
      {
        name: SERVICES,
        type: SELECT_FIELD,
        display_name: SERVICES_DISPLAY_NAME,
        option_strings_source: LOOKUPS.service_type
      },
      {
        name: DATE,
        display_name: FILTER_BY_DATE_DISPLAY_NAME,
        option_strings_text: [
          {
            id: SERVICE_RESPONSE_DAY_TIME,
            display_name: [
              MANAGED_REPORTS,
              PROCESS_QUALITY_SUCCESSFUL_REFERRALS,
              FILTER_OPTIONS,
              SERVICE_RESPONSE_DAY_TIME
            ]
          },
          {
            id: REFERRAL_CREATED_AT,
            display_name: [MANAGED_REPORTS, PROCESS_QUALITY_SUCCESSFUL_REFERRALS, FILTER_OPTIONS, REFERRAL_CREATED_AT]
          }
        ],
        type: SELECT_FIELD
      }
    ].map(filter => FieldRecord(filter))
  },
  process_quality_implemented_referrals: {
    ids: PROCESS_QUALITY_IMPLEMENTED_REFERRALS_SUBREPORTS,
    defaultFilterValues: {
      [GROUPED_BY]: MONTH,
      [DATE_RANGE]: LAST_MONTH,
      [STATUS]: [STATUS_OPEN],
      [DATE]: SERVICE_IMPLEMENTED_DAY_TIME
    },
    filters: [
      RECORD_FILTERS[GROUPED_BY],
      RECORD_FILTERS[DATE_RANGE],
      RECORD_FILTERS[FROM],
      RECORD_FILTERS[TO],
      {
        name: DATE,
        display_name: FILTER_BY_DATE_DISPLAY_NAME,
        option_strings_text: [
          {
            id: SERVICE_IMPLEMENTED_DAY_TIME,
            display_name: [
              MANAGED_REPORTS,
              PROCESS_QUALITY_IMPLEMENTED_REFERRALS,
              FILTER_OPTIONS,
              SERVICE_IMPLEMENTED_DAY_TIME
            ]
          }
        ],
        type: SELECT_FIELD
      },
      SHARED_FILTERS[MODULE],
      {
        ...RECORD_FILTERS[STATUS],
        display_name: [MANAGED_REPORTS, PROCESS_QUALITY_IMPLEMENTED_REFERRALS, FILTER_OPTIONS, CASE_STATUS]
      },
      {
        name: SERVICES,
        type: SELECT_FIELD,
        display_name: SERVICES_DISPLAY_NAME,
        option_strings_source: LOOKUPS.service_type
      },
      {
        name: REPORTING_LOCATIONS,
        type: SELECT_FIELD,
        display_name: REPORTING_LOCATIONS_DISPLAY_NAME,
        option_strings_source: LOOKUPS.reporting_locations
      }
    ].map(filter => FieldRecord(filter))
  },
  case_characteristics: {
    ids: CASE_CHARACTERISTICS_SUBREPORTS,
    defaultFilterValues: {
      [GROUPED_BY]: MONTH,
      [DATE_RANGE]: LAST_MONTH,
      [STATUS]: [STATUS_OPEN],
      [DATE]: REGISTRATION_DATE
    },
    filters: [
      RECORD_FILTERS[GROUPED_BY],
      RECORD_FILTERS[DATE_RANGE],
      RECORD_FILTERS[FROM],
      RECORD_FILTERS[TO],
      SHARED_FILTERS[MODULE],
      RECORD_FILTERS[STATUS],
      {
        name: DATE,
        display_name: FILTER_BY_DATE_DISPLAY_NAME,
        option_strings_text: [
          {
            id: REGISTRATION_DATE,
            display_name: [MANAGED_REPORTS, CASE_CHARACTERISTICS, FILTER_OPTIONS, REGISTRATION_DATE]
          },
          {
            id: DATE_CLOSURE,
            display_name: [MANAGED_REPORTS, CASE_CHARACTERISTICS, FILTER_OPTIONS, DATE_CLOSURE]
          }
        ],
        type: SELECT_FIELD
      },
      {
        name: REPORTING_LOCATIONS,
        type: SELECT_FIELD,
        display_name: REPORTING_LOCATIONS_DISPLAY_NAME,
        option_strings_source: LOOKUPS.reporting_locations
      }
    ].map(filter => FieldRecord(filter))
  }
};
