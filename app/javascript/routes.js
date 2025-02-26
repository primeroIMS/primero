// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import {
  Admin,
  AgenciesForm,
  AgenciesList,
  AuditLogs,
  Dashboard,
  ExportList,
  FormBuilder,
  FormsList,
  LocationsList,
  LookupsForm,
  LookupsList,
  NotAuthorized,
  NotFound,
  PotentialMatches,
  RolesForm,
  RolesList,
  ContactInformation as AdminContactInformation,
  TaskList,
  UserGroupsForm,
  UserGroupsList,
  UsersForm,
  UsersList,
  ConfigurationsList,
  ConfigurationsForm,
  CodeOfConduct as AdminCodeOfConduct,
  Support
} from "./components/pages";
import KeyPerformanceIndicators from "./components/key-performance-indicators";
import Report from "./components/report";
import Reports from "./components/reports-list";
import ReportsForm from "./components/reports-form";
import RecordForm from "./components/record-form/container";
import RecordList from "./components/record-list";
import InsightsList from "./components/insights-list";
import Insights from "./components/insights";
import InsightsSubReport from "./components/insights-sub-report";
import Account from "./components/pages/account";
import PasswordReset from "./components/password-reset";
import CodeOfConduct from "./components/code-of-conduct";
import ActivityLog from "./components/activity-log";
import { AppLayout, LoginLayout, EmptyLayout } from "./components/layouts";
import {
  CREATE_RECORDS,
  CREATE_REPORTS,
  RECORD_RESOURCES,
  READ_RECORDS,
  READ_REPORTS,
  RESOURCES,
  SHOW_EXPORTS,
  SHOW_TASKS,
  WRITE_RECORDS,
  ADMIN_RESOURCES,
  ADMIN_ACTIONS,
  VIEW_KPIS,
  ACTIVITY_LOGS,
  READ_MANAGED_REPORTS
} from "./components/permissions";
import Login, { IdpLogin } from "./components/login";
import Logout from "./components/logout";
import PasswordResetRequest from "./components/login/components/password-reset-form";
import { ROUTES, MODES, RECORD_PATH } from "./config";
import UsageReports from "./components/pages/admin/usage-reports";

const recordPaths = [
  RECORD_PATH.cases,
  RECORD_PATH.incidents,
  RECORD_PATH.tracing_requests,
  RECORD_PATH.registry_records,
  RECORD_PATH.families
];

const recordRoutes = [
  [MODES.edit, WRITE_RECORDS, ":id/edit"],
  [MODES.new, CREATE_RECORDS, ":module/new"],
  [MODES.show, READ_RECORDS, ":id"]
]
  .map(([mode, actions, path]) => {
    return recordPaths.map(recordPath => ({
      path: `/:recordType(${recordPath})/${path}`,
      component: RecordForm,
      extraProps: {
        mode
      },
      actions
    }));
  })
  .flat();

export default [
  {
    layout: LoginLayout,
    routes: [
      {
        path: ROUTES.login,
        component: Login
      },
      {
        path: ROUTES.password_reset,
        component: PasswordReset
      },
      {
        path: ROUTES.password_reset_request,
        component: PasswordResetRequest
      },
      {
        path: ROUTES.login_idp_redirect,
        component: IdpLogin
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
        path: ROUTES.activity_log,
        component: ActivityLog,
        resources: RESOURCES.activity_logs,
        actions: ACTIVITY_LOGS
      },
      ...recordRoutes,
      {
        path: "/cases",
        component: RecordList,
        actions: READ_RECORDS
      },
      {
        path: "/incidents",
        component: RecordList,
        actions: READ_RECORDS
      },
      {
        path: "/tracing_requests",
        component: RecordList,
        actions: READ_RECORDS
      },
      {
        path: "/registry_records",
        component: RecordList,
        actions: READ_RECORDS
      },
      {
        path: "/families",
        component: RecordList,
        actions: READ_RECORDS
      },
      {
        path: ROUTES.key_performance_indicators,
        component: KeyPerformanceIndicators,
        resources: RESOURCES.kpis,
        actions: VIEW_KPIS
      },
      {
        path: `${ROUTES.reports}/new`,
        component: ReportsForm,
        resources: RESOURCES.reports,
        extraProps: {
          mode: MODES.new
        },
        actions: CREATE_REPORTS
      },
      {
        path: `${ROUTES.reports}/:id(\\d+)`,
        component: Report,
        resources: RESOURCES.reports,
        actions: READ_REPORTS,
        extraProps: {
          mode: MODES.show
        }
      },
      {
        path: `${ROUTES.reports}/:id/edit`,
        component: ReportsForm,
        resources: RESOURCES.reports,
        actions: READ_REPORTS,
        extraProps: {
          mode: MODES.edit
        }
      },
      {
        path: ROUTES.reports,
        component: Reports,
        resources: RESOURCES.reports,
        actions: READ_REPORTS
      },
      {
        path: ROUTES.insights,
        component: InsightsList,
        resources: RESOURCES.managed_reports,
        actions: READ_MANAGED_REPORTS
      },
      {
        path: `${ROUTES.insights}/:moduleID/:id`,
        component: Insights,
        resources: RESOURCES.managed_reports,
        actions: READ_MANAGED_REPORTS,
        exact: false,
        extraProps: {
          mode: MODES.show,
          routes: [
            {
              path: `${ROUTES.insights}/:moduleID/:id/:subReport`,
              component: InsightsSubReport,
              resources: RESOURCES.managed_reports,
              actions: READ_MANAGED_REPORTS,
              extraProps: {
                mode: MODES.show
              }
            }
          ]
        }
      },
      {
        path: ROUTES.matches,
        component: PotentialMatches,
        resources: RESOURCES.potential_matches,
        actions: READ_RECORDS
      },
      {
        path: ROUTES.tasks,
        component: TaskList,
        resources: RESOURCES.dashboards,
        actions: SHOW_TASKS
      },
      {
        path: ROUTES.exports,
        component: ExportList,
        resources: RECORD_RESOURCES,
        actions: SHOW_EXPORTS
      },
      {
        path: ROUTES.support,
        component: Support
      },
      {
        path: `${ROUTES.account}/:id`,
        component: Account,
        resources: RESOURCES.any,
        extraProps: {
          mode: MODES.show
        }
      },
      {
        path: `${ROUTES.account}/:id/edit`,
        component: Account,
        resources: RESOURCES.any,
        extraProps: {
          mode: MODES.edit
        }
      },
      {
        path: ROUTES.admin,
        component: Admin,
        resources: ADMIN_RESOURCES,
        actions: ADMIN_ACTIONS,
        exact: false,
        extraProps: {
          routes: [
            {
              path: `${ROUTES.admin_users}/new`,
              component: UsersForm,
              resources: RESOURCES.users,
              extraProps: {
                mode: MODES.new
              }
            },
            {
              path: `${ROUTES.admin_users}/:id/edit`,
              component: UsersForm,
              resources: RESOURCES.users,
              extraProps: {
                mode: MODES.edit
              }
            },
            {
              path: `${ROUTES.admin_users}/:id`,
              component: UsersForm,
              resources: RESOURCES.users,
              extraProps: {
                mode: MODES.show
              }
            },
            {
              path: ROUTES.admin_users,
              component: UsersList,
              resources: RESOURCES.users,
              actions: ADMIN_ACTIONS
            },
            {
              path: ROUTES.usage_reports,
              component: UsageReports,
              resources: RESOURCES.usage_reports
            },
            {
              path: `${ROUTES.admin_user_groups}/new`,
              component: UserGroupsForm,
              resources: RESOURCES.user_groups,
              extraProps: {
                mode: MODES.new
              }
            },
            {
              path: `${ROUTES.admin_user_groups}/:id/edit`,
              component: UserGroupsForm,
              resources: RESOURCES.user_groups,
              extraProps: {
                mode: MODES.edit
              }
            },
            {
              path: `${ROUTES.admin_user_groups}/:id`,
              component: UserGroupsForm,
              resources: RESOURCES.user_groups,
              extraProps: {
                mode: MODES.show
              }
            },
            {
              path: `${ROUTES.contact_information}/edit`,
              component: AdminContactInformation,
              resources: RESOURCES.contact_information,
              extraProps: {
                mode: MODES.edit
              }
            },
            {
              path: `${ROUTES.contact_information}`,
              component: AdminContactInformation,
              resources: RESOURCES.contact_information,
              extraProps: {
                mode: MODES.show
              }
            },
            {
              path: `${ROUTES.admin_code_of_conduct}/edit`,
              component: AdminCodeOfConduct,
              resources: RESOURCES.codes_of_conduct,
              extraProps: {
                mode: MODES.edit
              }
            },
            {
              path: `${ROUTES.admin_code_of_conduct}`,
              component: AdminCodeOfConduct,
              resources: RESOURCES.codes_of_conduct,
              extraProps: {
                mode: MODES.show
              }
            },
            {
              path: ROUTES.admin_user_groups,
              component: UserGroupsList,
              resources: RESOURCES.user_groups
            },
            {
              path: `${ROUTES.admin_agencies}/new`,
              component: AgenciesForm,
              resources: RESOURCES.agencies,
              extraProps: {
                mode: MODES.new
              }
            },
            {
              path: `${ROUTES.admin_agencies}/:id/edit`,
              component: AgenciesForm,
              resources: RESOURCES.agencies,
              extraProps: {
                mode: MODES.edit
              }
            },
            {
              path: `${ROUTES.admin_agencies}/:id`,
              component: AgenciesForm,
              resources: RESOURCES.agencies,
              extraProps: {
                mode: MODES.show
              }
            },
            {
              path: ROUTES.admin_agencies,
              component: AgenciesList,
              resources: RESOURCES.agencies
            },
            {
              path: `${ROUTES.lookups}/new`,
              component: LookupsForm,
              resources: RESOURCES.lookups,
              extraProps: {
                mode: MODES.new
              }
            },
            {
              path: `${ROUTES.lookups}/:id/edit`,
              component: LookupsForm,
              resources: RESOURCES.lookups,
              extraProps: {
                mode: MODES.edit
              }
            },
            {
              path: `${ROUTES.lookups}/:id`,
              component: LookupsForm,
              resources: RESOURCES.lookups,
              extraProps: {
                mode: MODES.show
              }
            },
            {
              path: ROUTES.lookups,
              component: LookupsList,
              resources: RESOURCES.lookups
            },
            {
              path: ROUTES.audit_logs,
              component: AuditLogs,
              resources: RESOURCES.audit_logs
            },
            {
              path: `${ROUTES.admin_roles}/new`,
              component: RolesForm,
              resources: RESOURCES.roles,
              extraProps: {
                mode: MODES.new
              }
            },
            {
              path: `${ROUTES.admin_roles}/:id/edit`,
              component: RolesForm,
              resources: RESOURCES.roles,
              extraProps: {
                mode: MODES.edit
              }
            },
            {
              path: `${ROUTES.admin_roles}/:id`,
              component: RolesForm,
              resources: RESOURCES.roles,
              extraProps: {
                mode: MODES.show
              }
            },
            {
              path: ROUTES.admin_roles,
              component: RolesList,
              resources: RESOURCES.roles
            },
            {
              path: ROUTES.admin_roles,
              component: RolesList,
              resources: RESOURCES.roles
            },
            {
              path: `${ROUTES.forms}/new`,
              component: FormBuilder,
              resources: RESOURCES.forms,
              extraProps: {
                mode: MODES.new
              }
            },
            {
              path: `${ROUTES.forms}/:id/edit`,
              component: FormBuilder,
              resources: RESOURCES.forms,
              extraProps: {
                mode: MODES.edit
              }
            },
            {
              path: ROUTES.forms,
              component: FormsList,
              resources: RESOURCES.forms
            },
            {
              path: `${ROUTES.configurations}/new`,
              component: ConfigurationsForm,
              resources: RESOURCES.configurations,
              extraProps: {
                mode: MODES.new
              }
            },
            {
              path: `${ROUTES.configurations}/:id`,
              component: ConfigurationsForm,
              resources: RESOURCES.configurations,
              extraProps: {
                mode: MODES.show
              }
            },
            {
              path: ROUTES.configurations,
              component: ConfigurationsList,
              resources: RESOURCES.configurations
            },
            {
              path: ROUTES.locations,
              component: LocationsList,
              resources: RESOURCES.locations
            }
          ]
        }
      },
      {
        path: ROUTES.not_authorized,
        component: NotAuthorized
      }
    ]
  },
  {
    layout: EmptyLayout,
    routes: [
      {
        path: ROUTES.code_of_conduct,
        component: CodeOfConduct
      },
      {
        path: ROUTES.logout,
        component: Logout
      }
    ]
  },
  {
    component: NotFound
  }
];
