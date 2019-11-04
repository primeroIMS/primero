import * as Page from "components/pages";
import { RecordForm } from "components/record-form";
import RecordList from "components/record-list";
import { AppLayout, LoginLayout } from "components/layouts";
import { ROUTES } from "./constants";

export default [
  {
    layout: LoginLayout,
    routes: [
      {
        path: "/login",
        component: Page.Login
      },
      {
        path: "/logout",
        component: Page.Login
      }
    ]
  },
  {
    layout: AppLayout,
    routes: [
      {
        path: ROUTES.dashboard,
        component: Page.Dashboard
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
        component: Page.Reports,
        permissionType: "reports",
        permission: ["read", "group_read", "manage"]
      },
      {
        path: `${ROUTES.reports}/:id`,
        component: Page.Report,
        permissionType: "reports",
        permission: ["read", "group_read", "manage"]
      },
      {
        path: ROUTES.matches,
        component: Page.PotentialMatches,
        permissionType: "potential_matches",
        permission: "read"
      },
      {
        path: ROUTES.tasks,
        component: Page.TaskList,
        permissionType: "dashboards",
        permission: "dash_tasks"
      },
      {
        path: ROUTES.exports,
        component: Page.ExportList
      },
      {
        path: ROUTES.support,
        component: Page.Support
      },
      {
        path: "/not-authorized",
        component: Page.NotAuthorized
      }
    ]
  },
  {
    component: Page.NotFound
  }
];
