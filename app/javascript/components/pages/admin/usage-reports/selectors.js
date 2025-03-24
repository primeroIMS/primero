import { fromJS } from "immutable";

import { NAMESPACE } from "./constants";

// eslint-disable-next-line import/prefer-default-export
export const getUsageReportExport = state => state.getIn(["records", "admin", NAMESPACE, "export"], fromJS({}));
