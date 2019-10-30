import Login, {
  Admin,
  AgenciesForm,
  AgenciesList,
  AuditLogs,
  ContactInformation,
  Dashboard,
  ExportList,
  FormBuilder,
  FormsList,
  KeyPerformanceIndicators,
  LookupsForm,
  LookupsList,
  NotAuthorized,
  NotFound,
  PotentialMatches,
  RolesForm,
  RolesList,
  Support,
  TaskList,
  UserGroupsForm,
  UserGroupsList,
  UsersForm,
  UsersList
} from "../components/pages";
import Report from "../components/report";
import Reports from "../components/reports-list";
import ReportsForm from "../components/reports-form";
import RecordForm from "../components/record-form";
import RecordList from "../components/record-list";
import { AppLayout, LoginLayout } from "../components/layouts";
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
  ADMIN_ACTIONS
} from "../libs/permissions";

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
        extraProps: {
          mode: MODES.edit
        },
        actions: WRITE_RECORDS
      },
      {
        path: "/:recordType(cases|incidents|tracing_requests)/:module/new",
        component: RecordForm,
        extraProps: {
          mode: MODES.new
        },
        actions: CREATE_RECORDS
      },
      {
        path: "/:recordType(cases|incidents|tracing_requests)/:id",
        component: RecordForm,
        extraProps: {
          mode: MODES.show
        },
        actions: READ_RECORDS
      },
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
        path: ROUTES.key_performance_indicators,
        component: KeyPerformanceIndicators,
        permissionType: "reports",
        permission: ["read", "group_read", "manage"]
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
              component: ContactInformation,
              resources: RESOURCES.contact_information,
              extraProps: {
                mode: MODES.edit
              }
            },
            {
              path: `${ROUTES.contact_information}`,
              component: ContactInformation,
              resources: RESOURCES.contact_information,
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
    component: NotFound
  }
];
