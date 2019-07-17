import { combineReducers } from "redux-immutable";

import * as I18n from "components/i18n";
import * as TracingRequestList from "components/pages/tracing-request-list";
import * as IncidentList from "components/pages/incident-list";
import * as Login from "components/pages/login";
import * as Nav from "./components/nav";
import * as CaseList from "./components/pages/case-list";
import * as Dashboard from "./components/pages/dashboard";
import * as PotentialMatches from "./components/pages/potential-matches";
import * as TaskList from "./components/pages/task-list";
import * as RecordForms from "./components/record-form";
import * as ExportList from "./components/pages/export-list";
import * as Filter from "./components/filters";
import * as FiltersBuilder from "./components/filters-builder";
import * as Filters from "./components/filters-builder/filter-controls";
import * as Support from "./components/pages/support";

const rootReducer = {
  records: combineReducers({
    ...CaseList.reducers,
    ...TracingRequestList.reducers,
    ...IncidentList.reducers,
    ...PotentialMatches.reducers,
    ...TaskList.reducers,
    ...Dashboard.reducers,
    ...ExportList.reducers,
    ...Filter.reducers,
    ...FiltersBuilder.reducers,
    ...Filters.chipsReducer,
    ...Filters.radioButtonsReducer,
    ...Filters.rangeButtonReducer,
    ...Filters.selectReducer,
    ...Filters.checkboxReducer,
    ...Support.reducers
  }),
  ui: combineReducers({ ...Nav.reducers, ...I18n.reducers }),
  ...RecordForms.reducers,
  ...Login.reducers
};

export default rootReducer;
