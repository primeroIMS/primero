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
} from "../components/pages";
import { RecordForm } from "../components/record-form";
import RecordList from "../components/record-list";
import { AppLayout, LoginLayout } from "../components/layouts";
import { PERMISSION_CONSTANTS } from "../libs/permissions";

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
        permission: ["dash_tasks", "manage"]
      },
      {
        path: ROUTES.exports,
        component: ExportList,
        permissionType: ["cases", "incidents", "tracing_request"],
        permission: [
          PERMISSION_CONSTANTS.EXPORT_LIST_VIEW,
          PERMISSION_CONSTANTS.EXPORT_CSV,
          PERMISSION_CONSTANTS.EXPORT_EXCEL,
          PERMISSION_CONSTANTS.EXPORT_JSON,
          PERMISSION_CONSTANTS.EXPORT_PHOTO_WALL,
          PERMISSION_CONSTANTS.EXPORT_PDF,
          PERMISSION_CONSTANTS.EXPORT_UNHCR,
          PERMISSION_CONSTANTS.EXPORT_DUPLICATE_ID,
          PERMISSION_CONSTANTS.EXPORT_CASE_PDF,
          PERMISSION_CONSTANTS.EXPORT_MRM_VIOLATION_XLS,
          PERMISSION_CONSTANTS.EXPORT_INCIDENT_RECORDER,
          PERMISSION_CONSTANTS.EXPORT_CUSTOM,
          PERMISSION_CONSTANTS.MANAGE
        ]
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
