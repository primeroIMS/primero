import * as Page from "components/pages";
import { RecordForm } from "components/record-form";

export default [
  {
    layout: "LoginLayout",
    routes: [
      {
        path: "/login",
        component: Page.Login
      },
      {
        path: "/signout",
        component: Page.Login
      }
    ]
  },
  {
    layout: "AppLayout",
    routes: [
      {
        path: "/dashboard",
        component: Page.Dashboard,
        exact: true
      },
      {
        path: "/:recordType(cases|incidents|tracing_requests)/:id/edit",
        component: RecordForm,
        mode: "edit"
      },
      {
        path: "/:recordType(cases|incidents|tracing_requests)/:module/new",
        component: RecordForm,
        mode: "new"
      },
      {
        path: "/:recordType(cases|incidents|tracing_requests)/:id",
        component: RecordForm,
        mode: "show"
      },
      {
        path: "/cases",
        component: Page.CaseList
      },
      {
        path: "/incidents",
        component: Page.IncidentList
      },
      {
        path: "/tracing_requests",
        component: Page.TracingRequestList
      },
      {
        path: "/matches",
        component: Page.PotentialMatches
      },
      {
        path: "/tasks",
        component: Page.TaskList
      },
      {
        path: "/exports",
        component: Page.ExportList
      },
      {
        path: "/support",
        component: Page.Support
      }
    ]
  }
];
