import * as Page from "components/pages";
import * as Layouts from "components/layouts";
import { RecordForm } from "components/record-form";

export default [
  {
    path: "/login",
    component: Layouts.LoginLayout,
    routes: [
      {
        path: "/login",
        component: Page.Login
      }
    ]
  },
  {
    path: "/",
    component: Layouts.AppLayout,
    routes: [
      {
        path: "/",
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
      }
    ]
  }
];
