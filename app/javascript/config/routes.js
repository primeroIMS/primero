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
        path: "/cases/new/:module",
        component: Page.CaseNew
      },
      {
        path: "/cases/:id/edit",
        component: Page.CaseEdit
      },
      {
        path: "/cases/:id",
        component: Page.CaseShow
      },
      {
        path: "/cases",
        component: Page.CaseList
      },
      {
        path: "/incidents/new/:module",
        component: Page.IncidentNew
      },
      {
        path: "/incidents/:id/edit",
        component: Page.IncidentEdit
      },
      {
        path: "/incidents/:id",
        component: Page.IncidentShow
      },
      {
        path: "/incidents",
        component: Page.IncidentList
      },
      {
        path: "/tracing-requests/new/:module",
        component: Page.TracingRequestNew
      },
      {
        path: "/tracing-requests/:id/edit",
        component: Page.TracingRequestEdit
      },
      {
        path: "/tracing-requests/:id",
        component: Page.TracingRequestShow
      },
      {
        path: "/tracing-requests",
        component: Page.TracingRequestList
      }
    ]
  }
];
