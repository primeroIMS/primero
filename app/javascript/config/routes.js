import * as Page from "components/pages";
import { RecordForm } from "components/record-form";
import { RecordList } from "components/record-list";
import { AppLayout, LoginLayout } from "components/layouts";

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
        path: "/dashboard",
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
        path: "/reports",
        component: Page.Reports,
        permissionType: "reports",
        permission: ["read", "group_read", "manage"]
      },
      {
        path: "/reports/:id",
        component: Page.Report,
        permissionType: "reports",
        permission: ["read", "group_read", "manage"]
      },
      {
        path: "/matches",
        component: Page.PotentialMatches,
        permissionType: "potential_matches",
        permission: "read"
      },
      {
        path: "/tasks",
        component: Page.TaskList,
        permissionType: "dashboards",
        permission: "dash_tasks"
      },
      {
        path: "/exports",
        component: Page.ExportList
      },
      {
        path: "/support",
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
