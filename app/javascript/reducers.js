import { combineReducers } from "redux-immutable";

import * as I18n from "components/i18n";
import * as TracingRequestList from "components/pages/tracing-request-list";
import * as IncidentList from "components/pages/incident-list";
import * as Login from "components/pages/login";
import * as Nav from "./components/nav";
import * as CaseList from "./components/pages/case-list";
import * as Dashboard from "./components/pages/dashboard";
import * as RecordForms from "./components/record-form";
import * as ExportList from "./components/pages/export-list";

const rootReducer = {
  records: combineReducers({
    ...CaseList.reducers,
    ...TracingRequestList.reducers,
    ...IncidentList.reducers,
    ...Dashboard.reducers,
    ...ExportList.reducers
  }),
  ui: combineReducers({ ...Nav.reducers, ...I18n.reducers }),
  ...RecordForms.reducers,
  ...Login.reducers
};

export default rootReducer;
