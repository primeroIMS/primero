import * as Page from "components/pages";

export default [
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
    component: Page.Incidents
  }
];
