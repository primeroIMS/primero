import * as Page from "../containers";

export default [
  {
    path: "/",
    component: Page.Dashboard,
    exact: true
  },
  {
    path: "/cases",
    component: Page.Cases
  },
  {
    path: "/incidents",
    component: Page.Incidents
  }
];
