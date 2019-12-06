import {
  Dashboard,
  Reports,
  Report,
  PotentialMatches,
  TaskList,
  ExportList,
  Support,
  NotAuthorized,
  NotFound
} from "../components/pages";
import Login from "../components/pages";
import RecordForm from "../components/record-form";
import RecordList from "../components/record-list";
import { AppLayout, LoginLayout } from "../components/layouts";
import {
  CREATE_RECORDS,
  RECORD_RESOURCES,
  READ_RECORDS,
  READ_REPORTS,
  RESOURCES,
  SHOW_EXPORTS,
  SHOW_TASKS,
  WRITE_RECORDS
} from "../libs/permissions";

import { ROUTES, MODES } from "./constants";

export default [
  {
    layout: LoginLayout,
    routes: [
      {
        path: ROUTES.login,
        component: Login
      },
      {
        path: ROUTES.login_redirect,
        component: Login
      },
      {
        path: ROUTES.logout,
        component: Login
      }
    ]
  },
  {
    layout: AppLayout,
    routes: [
      {
        path: ROUTES.dashboard,
        component: Dashboard
      },
      {
        path: "/:recordType(cases|incidents|tracing_requests)/:id/edit",
        component: RecordForm,
        mode: MODES.edit,
        actions: WRITE_RECORDS
      },
      {
        path: "/:recordType(cases|incidents|tracing_requests)/:module/new",
        component: RecordForm,
        mode: MODES.new,
        actions: CREATE_RECORDS
      },
      {
        path: "/:recordType(cases|incidents|tracing_requests)/:id",
        component: RecordForm,
        mode: MODES.show,
        actions: READ_RECORDS
      },
      {
        path: "/:recordType(cases|incidents|tracing_requests)",
        component: RecordList,
        actions: READ_RECORDS
      },
      {
        path: ROUTES.reports,
        component: Reports,
        resources: RESOURCES.reports,
        actions: READ_REPORTS
      },
      {
        path: `${ROUTES.reports}/:id`,
        component: Report,
        resources: RESOURCES.reports,
        actions: READ_REPORTS
      },
      {
        path: ROUTES.matches,
        component: PotentialMatches,
        resources: RESOURCES.potential_matches,
        actions: READ_RECORDS
      },
      {
        path: ROUTES.tasks,
        component: TaskList,
        resources: RESOURCES.dashboards,
        actions: SHOW_TASKS
      },
      {
        path: ROUTES.exports,
        component: ExportList,
        resources: RECORD_RESOURCES,
        actions: SHOW_EXPORTS
      },
      {
        path: ROUTES.support,
        component: Support
      },
      {
        path: ROUTES.not_authorized,
        component: NotAuthorized
      }
    ]
  },
  {
    component: NotFound
  }
];
