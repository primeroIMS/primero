import {
  Login,
  Dashboard,
  Reports,
  Report,
  PotentialMatches,
  TaskList,
  ExportList,
  Support,
  NotAuthorized,
  NotFound
} from "./../components/pages";
import { RecordForm } from "./../components/record-form";
import RecordList from "./../components/record-list";
import { AppLayout, LoginLayout } from "./../components/layouts";

import { ROUTES } from "./constants";

export default [
  {
    layout: LoginLayout,
    routes: [
      {
        path: "/login",
        component: Login
      },
      {
        path: "/logout",
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
        mode: "edit",
        permission: ["write", "manage"]
      },
      {
        path: "/:recordType(cases|incidents|tracing_requests)/:module/new",
        component: RecordForm,
        mode: "new",
        permission: ["create", "manage"]
      },
      {
        path: "/:recordType(cases|incidents|tracing_requests)/:id",
        component: RecordForm,
        mode: "show",
        permission: ["read", "manage"]
      },
      {
        path: "/:recordType(cases|incidents|tracing_requests)",
        component: RecordList,
        permission: ["read", "manage"]
      },
      {
        path: ROUTES.reports,
        component: Reports,
        permissionType: "reports",
        permission: ["read", "group_read", "manage"]
      },
      {
        path: `${ROUTES.reports}/:id`,
        component: Report,
        permissionType: "reports",
        permission: ["read", "group_read", "manage"]
      },
      {
        path: ROUTES.matches,
        component: PotentialMatches,
        permissionType: "potential_matches",
        permission: "read"
      },
      {
        path: ROUTES.tasks,
        component: TaskList,
        permissionType: "dashboards",
        permission: "dash_tasks"
      },
      {
        path: ROUTES.exports,
        component: ExportList
      },
      {
        path: ROUTES.support,
        component: Support
      },
      {
        path: "/not-authorized",
        component: NotAuthorized
      }
    ]
  },
  {
    component: NotFound
  }
];
