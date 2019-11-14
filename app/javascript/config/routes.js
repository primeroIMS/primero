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
import RecordForm from "../components/record-form";
import RecordList from "../components/record-list";
import { AppLayout, LoginLayout } from "../components/layouts";
import { PERMISSION_CONSTANTS, RESOURCES } from "../libs/permissions";

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
        permission: [PERMISSION_CONSTANTS.WRITE, PERMISSION_CONSTANTS.MANAGE]
      },
      {
        path: "/:recordType(cases|incidents|tracing_requests)/:module/new",
        component: RecordForm,
        mode: MODES.new,
        permission: [PERMISSION_CONSTANTS.CREATE, PERMISSION_CONSTANTS.MANAGE]
      },
      {
        path: "/:recordType(cases|incidents|tracing_requests)/:id",
        component: RecordForm,
        mode: MODES.show,
        permission: [PERMISSION_CONSTANTS.READ, PERMISSION_CONSTANTS.MANAGE]
      },
      {
        path: "/:recordType(cases|incidents|tracing_requests)",
        component: RecordList,
        permission: [PERMISSION_CONSTANTS.READ, PERMISSION_CONSTANTS.MANAGE]
      },
      {
        path: ROUTES.reports,
        component: Reports,
        permissionType: RESOURCES.reports,
        permission: [
          PERMISSION_CONSTANTS.READ,
          PERMISSION_CONSTANTS.GROUP_READ,
          PERMISSION_CONSTANTS.MANAGE
        ]
      },
      {
        path: `${ROUTES.reports}/:id`,
        component: Report,
        permissionType: RESOURCES.reports,
        permission: [
          PERMISSION_CONSTANTS.READ,
          PERMISSION_CONSTANTS.GROUP_READ,
          PERMISSION_CONSTANTS.MANAGE
        ]
      },
      {
        path: ROUTES.matches,
        component: PotentialMatches,
        permissionType: RESOURCES.potential_matches,
        permission: PERMISSION_CONSTANTS.READ
      },
      {
        path: ROUTES.tasks,
        component: TaskList,
        permissionType: RESOURCES.dashboards,
        permission: [
          PERMISSION_CONSTANTS.DASH_TASKS,
          PERMISSION_CONSTANTS.MANAGE
        ]
      },
      {
        path: ROUTES.exports,
        component: ExportList,
        permissionType: [
          RESOURCES.cases,
          RESOURCES.incidents,
          RESOURCES.tracing_requests
        ],
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
        path: ROUTES.not_authorized,
        component: NotAuthorized
      }
    ]
  },
  {
    component: NotFound
  }
];
