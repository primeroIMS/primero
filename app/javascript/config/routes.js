import * as Page from "components/pages";
import * as Layouts from "components/layouts";

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
        path: "/cases",
        component: Page.CaseList
      },
      {
        path: "/incidents",
        component: Page.IncidentList
      },
      {
        path: "/tracing-requests",
        component: Page.TracingRequestList
      }
    ]
  }
];
