import { VIOLATIONS_SUBFORM_UNIQUE_IDS } from "../../config/constants";

export const NAME = "ManagedReport";
export const DELETE_MODAL = "DeleteReportModal";
export const DATE_PATTERN = "(\\w{2}-)?\\w{3}-\\d{4}";
export const TOTAL = "Total";
export const TOTAL_KEY = "_total";

export const INSIGHTS_CONFIG = {
  mrm: {
    ids: VIOLATIONS_SUBFORM_UNIQUE_IDS,
    localeKeys: ["incident", "violation", "types"]
  },
  gbv: {}
};
