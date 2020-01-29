def create_or_update_role(role_hash)
  role = Role.find_by(unique_id: role_hash[:unique_id])

  if role.blank?
    puts "Creating role #{role_hash[:unique_id]}"
    role = Role.create! role_hash
  else
    puts "Updating role #{role_hash[:unique_id]}"
    role.update_attributes role_hash
  end
  role.associate_all_forms
end

cp_admin_permissions = [
  Permission.new(
    resource: Permission::CASE,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::FLAG,
      Permission::ASSIGN,
      Permission::CONSENT_OVERRIDE,
      Permission::IMPORT,
      Permission::REFERRAL,
      Permission::TRANSFER,
      Permission::EXPORT_CUSTOM,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_UNHCR,
      Permission::SEARCH_OWNED_BY_OTHERS,
      Permission::CREATE,
      Permission::VIEW_PROTECTION_CONCERNS_FILTER,
      Permission::ENABLE_DISABLE_RECORD,
      Permission::REOPEN,
      Permission::CLOSE
    ]
  ),
  Permission.new(
    resource: Permission::TRACING_REQUEST,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::FLAG,
      Permission::ASSIGN,
      Permission::IMPORT,
      Permission::EXPORT_CUSTOM,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_UNHCR,
      Permission::CREATE
    ]
  ),
  Permission.new(
    resource: Permission::ROLE,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::ASSIGN,
      Permission::IMPORT,
      Permission::EXPORT_CUSTOM,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::CREATE
    ],
    role_unique_ids: [
      'role-cp-case-worker',
      'role-cp-manager',
      'role-cp-user-manager',
      'role-referral',
      'role-transfer'
    ]
  ),
  Permission.new(
    resource: Permission::USER,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE
    ]
  ),
  Permission.new(
      resource: Permission::USER_GROUP,
      actions: [
          Permission::READ,
          Permission::WRITE,
          Permission::CREATE,
          Permission::ASSIGN
      ]
  ),
  Permission.new(
      resource: Permission::AGENCY,
      actions: [
          Permission::READ,
          Permission::WRITE,
          Permission::CREATE
      ]
  ),
  Permission.new(
    resource: Permission::REPORT,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE
    ]
  ),
  Permission.new(
    resource: Permission::METADATA,
    actions: [Permission::MANAGE]
  ),
  Permission.new(
    resource:  Permission::SYSTEM,
    actions: [Permission::MANAGE]
  ),
  Permission.new(
    resource: Permission::INCIDENT,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE
    ]
  ),
  Permission.new(
      resource: Permission::AUDIT_LOG,
      actions: [Permission::READ]
  ),
  Permission.new(
    resource: Permission::DUPLICATE,
    actions: [Permission::READ]
  ),
  Permission.new(
    resource: Permission::DASHBOARD,
    actions: [
      Permission::DASH_REPORTING_LOCATION
    ]
  )
]

create_or_update_role(
  unique_id: 'role-cp-administrator',
  name: 'CP Administrator',
  permissions: cp_admin_permissions,
  group_permission: Permission::ALL,
  is_manager: true,
  modules: [ PrimeroModule.cp ]
)

cp_caseworker_permissions = [
  Permission.new(
    resource: Permission::CASE,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::FLAG,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_UNHCR,
      Permission::SYNC_MOBILE,
      Permission::REQUEST_APPROVAL_CASE_PLAN,
      Permission::SEARCH_OWNED_BY_OTHERS,
      Permission::INCIDENT_FROM_CASE,
      Permission::CREATE,
      Permission::REFERRAL_FROM_SERVICE,
      Permission::REFERRAL,
      Permission::RECEIVE_REFERRAL,
      Permission::RECEIVE_TRANSFER,
      Permission::VIEW_PROTECTION_CONCERNS_FILTER,
      Permission::REMOVE_ASSIGNED_USERS,
      Permission::ENABLE_DISABLE_RECORD,
      Permission::DISPLAY_VIEW_PAGE,
      Permission::INCIDENT_DETAILS_FROM_CASE
    ]
  ),
  Permission.new(
    resource: Permission::TRACING_REQUEST,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::FLAG,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_UNHCR,
      Permission::CREATE
    ]
  ),
  Permission.new(
    resource: Permission::POTENTIAL_MATCH,
    actions: [
      Permission::READ
    ]
  ),
  Permission.new(
    resource: Permission::DASHBOARD,
    actions: [
      Permission::DASH_WORKFLOW,
      Permission::DASH_APPROVALS_ASSESSMENT,
      Permission::DASH_APPROVALS_CASE_PLAN,
      Permission::DASH_APPROVALS_CLOSURE,
      Permission::VIEW_RESPONSE,
      Permission::DASH_CASE_RISK,
      Permission::VIEW_PROTECTION_CONCERNS_FILTER,
      Permission::DASH_TASKS
    ]
  ),
  Permission.new(
    resource: Permission::INCIDENT,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE
    ]
  )
]

create_or_update_role(
  unique_id: "role-cp-case-worker",
  name: "CP Case Worker",
  permissions: cp_caseworker_permissions,
  modules: [ PrimeroModule.cp ]
)

cp_manager_permissions = [
  Permission.new(
    resource: Permission::CASE,
    actions: [
      Permission::READ,
      Permission::FLAG,
      Permission::ASSIGN,
      Permission::CONSENT_OVERRIDE,
      Permission::EXPORT_CUSTOM,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_UNHCR,
      Permission::SYNC_MOBILE,
      Permission::APPROVE_CASE_PLAN,
      Permission::SEARCH_OWNED_BY_OTHERS,
      Permission::INCIDENT_FROM_CASE,
      Permission::VIEW_PROTECTION_CONCERNS_FILTER,
      Permission::ENABLE_DISABLE_RECORD,
      Permission::ADD_NOTE,
      Permission::REOPEN,
      Permission::CLOSE,
      Permission::DISPLAY_VIEW_PAGE,
      Permission::RECEIVE_TRANSFER
    ]
  ),
  Permission.new(
    resource: Permission::TRACING_REQUEST,
    actions: [
      Permission::READ,
      Permission::FLAG,
      Permission::ASSIGN,
      Permission::EXPORT_CUSTOM,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_UNHCR
    ]
  ),
  Permission.new(
    resource: Permission::POTENTIAL_MATCH,
    actions: [
      Permission::READ
    ]
  ),
  Permission.new(
    resource: Permission::REPORT,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE
    ]
  ),
  Permission.new(
    resource: Permission::ROLE,
    actions: [
      Permission::READ,
      Permission::EXPORT_CUSTOM,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PDF
    ]
  ),
  Permission.new(
    resource: Permission::USER,
    actions: [
      Permission::READ
    ]
  ),
  Permission.new(
      resource: Permission::USER_GROUP,
      actions: [
          Permission::READ
      ]
  ),
  Permission.new(
      resource: Permission::AGENCY,
      actions: [
          Permission::READ
      ]
  ),
  Permission.new(
      resource: Permission::DASHBOARD,
      actions: [
        Permission::DASH_WORKFLOW_TEAM,
        Permission::DASH_APPROVALS_ASSESSMENT_PENDING,
        Permission::DASH_APPROVALS_CASE_PLAN_PENDING,
        Permission::DASH_APPROVALS_CLOSURE_PENDING,
        Permission::VIEW_RESPONSE,
        Permission::DASH_CASE_RISK,
        Permission::VIEW_PROTECTION_CONCERNS_FILTER,
        Permission::DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT,
        Permission::DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN,
        Permission::DASH_CASES_BY_TASK_OVERDUE_SERVICES,
        Permission::DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS
      ]
  )
]

create_or_update_role(
  unique_id: 'role-cp-manager',
  name: 'CP Manager',
  permissions: cp_manager_permissions,
  group_permission: Permission::GROUP,
  is_manager: true,
  modules: [ PrimeroModule.cp ]
)

cp_user_manager_permissions = [
    Permission.new(
        resource: Permission::CASE,
        actions: [
            Permission::READ,
            Permission::FLAG,
            Permission::ASSIGN,
            Permission::CONSENT_OVERRIDE,
            Permission::EXPORT_CUSTOM,
            Permission::EXPORT_LIST_VIEW,
            Permission::EXPORT_CSV,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON,
            Permission::EXPORT_PHOTO_WALL,
            Permission::EXPORT_PDF,
            Permission::EXPORT_UNHCR,
            Permission::SYNC_MOBILE,
            Permission::APPROVE_CASE_PLAN,
            Permission::VIEW_PROTECTION_CONCERNS_FILTER
        ]
    ),
    Permission.new(
        resource: Permission::TRACING_REQUEST,
        actions: [
            Permission::READ,
            Permission::FLAG,
            Permission::ASSIGN,
            Permission::EXPORT_CUSTOM,
            Permission::EXPORT_LIST_VIEW,
            Permission::EXPORT_CSV,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON,
            Permission::EXPORT_PHOTO_WALL,
            Permission::EXPORT_PDF,
            Permission::EXPORT_UNHCR
        ]
    ),
    Permission.new(
        resource: Permission::POTENTIAL_MATCH,
        actions: [
            Permission::READ
        ]
    ),
    Permission.new(
        resource: Permission::REPORT,
        actions: [
            Permission::READ,
            Permission::WRITE
        ]
    ),
    Permission.new(
        resource: Permission::ROLE,
        actions: [
            Permission::READ,
            Permission::ASSIGN,
            Permission::EXPORT_CUSTOM,
            Permission::EXPORT_LIST_VIEW,
            Permission::EXPORT_CSV,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON
        ]
    ),
    Permission.new(
        resource: Permission::USER,
        actions: [
            Permission::READ,
            Permission::CREATE,
            Permission::WRITE
        ]
    ),
    Permission.new(
        resource: Permission::USER_GROUP,
        actions: [
            Permission::READ,
            Permission::CREATE,
            Permission::WRITE,
            Permission::ASSIGN
        ]
    ),
    Permission.new(
        resource: Permission::AGENCY,
        actions: [
            Permission::READ,
            Permission::CREATE,
            Permission::WRITE
        ]
    ),
    Permission.new(
        resource: Permission::DASHBOARD,
        actions: [
          Permission::DASH_APPROVALS_ASSESSMENT_PENDING,
          Permission::DASH_APPROVALS_CASE_PLAN_PENDING,
          Permission::DASH_APPROVALS_CLOSURE_PENDING,
          Permission::VIEW_RESPONSE,
          Permission::DASH_CASE_RISK,
          Permission::VIEW_PROTECTION_CONCERNS_FILTER
        ]
    )
]

create_or_update_role(
    unique_id: 'role-cp-user-manager',
    name: 'CP User Manager',
    permissions: cp_user_manager_permissions,
    group_permission: Permission::GROUP,
    is_manager: true,
    modules: [ PrimeroModule.cp ]
)

gbv_worker_permissions = [
  Permission.new(
    resource: Permission::CASE,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::FLAG,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_UNHCR,
      Permission::SYNC_MOBILE,
      Permission::INCIDENT_FROM_CASE,
      Permission::CREATE,
      Permission::VIEW_PROTECTION_CONCERNS_FILTER,
      Permission::ENABLE_DISABLE_RECORD,
      Permission::REQUEST_APPROVAL_CASE_PLAN,
      Permission::REQUEST_APPROVAL_CLOSURE
    ]
  ),
  Permission.new(
    resource: Permission::INCIDENT,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::FLAG,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_UNHCR,
      Permission::EXPORT_INCIDENT_RECORDER,
      Permission::SYNC_MOBILE,
      Permission::CREATE
    ]
  ),
  Permission.new(
    resource: Permission::DASHBOARD,
    actions: [
      Permission::DASH_APPROVALS_ASSESSMENT_PENDING,
      Permission::DASH_APPROVALS_CASE_PLAN_PENDING,
      Permission::DASH_APPROVALS_CLOSURE_PENDING
    ]
  )
]

create_or_update_role(
  unique_id: "role-gbv-social-worker",
  name: "GBV Social Worker",
  permissions: gbv_worker_permissions,
  modules: [ PrimeroModule.gbv ]
)

gbv_manager_permissions = [
  Permission.new(
    resource: Permission::CASE,
    actions: [
      Permission::READ,
      Permission::FLAG,
      Permission::ASSIGN,
      Permission::CONSENT_OVERRIDE,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::SYNC_MOBILE,
      Permission::VIEW_PROTECTION_CONCERNS_FILTER,
      Permission::REMOVE_ASSIGNED_USERS,
      Permission::ENABLE_DISABLE_RECORD,
      Permission::APPROVE_CASE_PLAN,
      Permission::APPROVE_CLOSURE
    ]
  ),
  Permission.new(
    resource: Permission::INCIDENT,
    actions: [
      Permission::READ,
      Permission::FLAG,
      Permission::ASSIGN,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_UNHCR,
      Permission::EXPORT_INCIDENT_RECORDER,
      Permission::SYNC_MOBILE
    ]
  ),
  Permission.new(
    resource: Permission::REPORT,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE
    ]
  ),
  Permission.new(
    resource: Permission::ROLE,
    actions: [
      Permission::READ,
      Permission::EXPORT_CUSTOM,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_UNHCR
    ]
  ),
  Permission.new(
    resource: Permission::USER,
    actions: [
      Permission::READ
    ]
  ),
  Permission.new(
      resource: Permission::USER_GROUP,
      actions: [
          Permission::READ
      ]
  ),
  Permission.new(
    resource: Permission::DASHBOARD,
    actions: [
      Permission::DASH_APPROVALS_ASSESSMENT_PENDING,
      Permission::DASH_APPROVALS_CASE_PLAN_PENDING,
      Permission::DASH_APPROVALS_CLOSURE_PENDING,
      Permission::DASH_REPORTING_LOCATION
    ]
  ),
  Permission.new(
      resource: Permission::AGENCY,
      actions: [
          Permission::READ
      ]
  )
]

create_or_update_role(
    unique_id: "role-gbv-manager",
    name: "GBV Manager",
    permissions: gbv_manager_permissions,
    group_permission: Permission::GROUP,
    is_manager: true,
    modules: [ PrimeroModule.gbv ]
)

gbv_user_manager_permissions = [
    Permission.new(
        resource: Permission::CASE,
        actions: [
            Permission::READ,
            Permission::FLAG,
            Permission::ASSIGN,
            Permission::CONSENT_OVERRIDE,
            Permission::EXPORT_LIST_VIEW,
            Permission::EXPORT_CSV,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON,
            Permission::EXPORT_PHOTO_WALL,
            Permission::EXPORT_PDF,
            Permission::EXPORT_UNHCR,
            Permission::SYNC_MOBILE,
            Permission::VIEW_PROTECTION_CONCERNS_FILTER,
            Permission::APPROVE_CASE_PLAN,
            Permission::APPROVE_CLOSURE
        ]
    ),
    Permission.new(
        resource: Permission::INCIDENT,
        actions: [
            Permission::READ,
            Permission::FLAG,
            Permission::ASSIGN,
            Permission::EXPORT_LIST_VIEW,
            Permission::EXPORT_CSV,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON,
            Permission::EXPORT_PHOTO_WALL,
            Permission::EXPORT_PDF,
            Permission::EXPORT_UNHCR,
            Permission::EXPORT_INCIDENT_RECORDER,
            Permission::SYNC_MOBILE
        ]
    ),
    Permission.new(
        resource: Permission::REPORT,
        actions: [
            Permission::READ,
            Permission::WRITE
        ]
    ),
    Permission.new(
        resource: Permission::ROLE,
        actions: [
            Permission::READ,
            Permission::ASSIGN,
            Permission::EXPORT_CUSTOM,
            Permission::EXPORT_LIST_VIEW,
            Permission::EXPORT_CSV,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON,
            Permission::EXPORT_PHOTO_WALL,
            Permission::EXPORT_UNHCR
        ]
    ),
    Permission.new(
        resource: Permission::USER,
        actions: [
            Permission::READ,
            Permission::CREATE,
            Permission::WRITE
        ]
    ),
    Permission.new(
        resource: Permission::USER_GROUP,
        actions: [
            Permission::READ,
            Permission::CREATE,
            Permission::WRITE,
            Permission::ASSIGN
        ]
    ),
    Permission.new(
        resource: Permission::AGENCY,
        actions: [
            Permission::READ,
            Permission::CREATE,
            Permission::WRITE
        ]
    ),
    Permission.new(
      resource: Permission::DASHBOARD,
      actions: [
        Permission::DASH_APPROVALS_ASSESSMENT_PENDING,
        Permission::DASH_APPROVALS_CASE_PLAN_PENDING,
        Permission::DASH_APPROVALS_CLOSURE_PENDING
      ]
    )
]

create_or_update_role(
    unique_id: "role-gbv-user-manager",
    name: "GBV User Manager",
    permissions: gbv_user_manager_permissions,
    group_permission: Permission::GROUP,
    is_manager: true,
    modules: [ PrimeroModule.gbv ]
)


gbv_caseworker_forms = [
  "action_plan_form", "gbv_case_closure_form", "consent_for_referrals", "other_documents", "record_owner",
  "referral_transfer", "safety_plan", "survivor_assessment_form", "gbv_survivor_information",
  "alleged_perpetrators_wrapper", "gbv_incident_form", "gbv_individual_details", "incident_record_owner",
  "incident_service_referrals", "gbv_sexual_violence", "action_plan_subform_section", "gbv_follow_up_subform_section",
  "reopened_logs", "transitions", "alleged_perpetrator", "health_medical_referral_subform_section",
  "psychosocial_counseling_services_subform_section", "legal_assistance_services_subform_section",
  "police_or_other_type_of_security_services_subform_section", "livelihoods_services_subform_section",
  "child_protection_services_subform_section", "gbv_reported_elsewhere_subform"
]

gbv_caseworker_permissions = [
    Permission.new(
        resource: Permission::CASE,
        actions: [
            Permission::READ,
            Permission::WRITE,
            Permission::FLAG,
            Permission::CONSENT_OVERRIDE,
            Permission::EXPORT_PDF,
            Permission::REQUEST_APPROVAL_CASE_PLAN,
            Permission::REQUEST_APPROVAL_BIA,
            Permission::REQUEST_APPROVAL_CLOSURE,
            Permission::APPROVE_CASE_PLAN,
            Permission::APPROVE_CLOSURE
        ]
    ),
    Permission.new(
        resource: Permission::INCIDENT,
        actions: [
            Permission::READ,
            Permission::WRITE,
            Permission::FLAG
        ]
    ),
    Permission.new(
      resource: Permission::DASHBOARD,
      actions: [
        Permission::DASH_APPROVALS_CASE_PLAN,
        Permission::DASH_APPROVALS_CLOSURE
      ]
    )
]

create_or_update_role(
    unique_id: "role-gbv-caseworker",
    name: "GBV Caseworker",
    permissions: gbv_caseworker_permissions,
    form_sections: FormSection.where(unique_id: gbv_caseworker_forms),
    modules: [ PrimeroModule.gbv ]
)

gbv_mobile_caseworker_forms = [
    "action_plan_form", "gbv_case_closure_form", "consent_for_referrals", "other_documents", "record_owner",
    "referral_transfer", "safety_plan", "survivor_assessment_form", "gbv_survivor_information",
    "alleged_perpetrators_wrapper", "gbv_incident_form", "gbv_individual_details", "incident_record_owner",
    "incident_service_referrals", "gbv_sexual_violence", "action_plan_subform_section", "gbv_follow_up_subform_section",
    "reopened_logs", "transitions", "alleged_perpetrator", "health_medical_referral_subform_section",
    "psychosocial_counseling_services_subform_section", "legal_assistance_services_subform_section",
    "police_or_other_type_of_security_services_subform_section", "livelihoods_services_subform_section",
    "child_protection_services_subform_section", "gbv_reported_elsewhere_subform"
]

gbv_mobile_caseworker_permissions = [
    Permission.new(
        resource: Permission::CASE,
        actions: [
            Permission::READ,
            Permission::WRITE,
            Permission::FLAG,
            Permission::CONSENT_OVERRIDE,
            Permission::EXPORT_PDF,
            Permission::REQUEST_APPROVAL_CASE_PLAN,
            Permission::REQUEST_APPROVAL_BIA,
            Permission::REQUEST_APPROVAL_CLOSURE,
            Permission::SYNC_MOBILE
        ]
    ),
    Permission.new(
        resource: Permission::INCIDENT,
        actions: [
            Permission::READ,
            Permission::WRITE,
            Permission::FLAG,
            Permission::SYNC_MOBILE
        ]
    )
]

create_or_update_role(
    unique_id: "role-gbv-mobile-caseworker",
    name: "GBV Mobile Caseworker",
    permissions: gbv_mobile_caseworker_permissions,
    form_sections: FormSection.where(unique_id: gbv_mobile_caseworker_forms),
    modules: [ PrimeroModule.gbv ]
)

gbv_cm_supervisor_forms = [
    "action_plan_form", "gbv_case_closure_form", "consent_for_referrals", "other_documents", "record_owner",
    "referral_transfer", "safety_plan", "survivor_assessment_form", "gbv_survivor_information", "alleged_perpetrators_wrapper",
    "gbv_incident_form", "gbv_individual_details", "incident_record_owner", "incident_service_referrals", "gbv_sexual_violence",
    "action_plan_subform_section", "gbv_follow_up_subform_section", "reopened_logs", "transitions", "alleged_perpetrator",
    "health_medical_referral_subform_section", "psychosocial_counseling_services_subform_section",
    "legal_assistance_services_subform_section", "police_or_other_type_of_security_services_subform_section",
    "livelihoods_services_subform_section", "child_protection_services_subform_section", "gbv_reported_elsewhere_subform"
]

gbv_cm_supervisor_permissions = [
    Permission.new(
        resource: Permission::CASE,
        actions: [
            Permission::READ,
            Permission::FLAG,
            Permission::ASSIGN,
            Permission::EXPORT_JSON,
            Permission::EXPORT_PDF,
            Permission::CONSENT_OVERRIDE,
            Permission::EXPORT_PDF,
            Permission::APPROVE_BIA,
            Permission::APPROVE_CASE_PLAN,
            Permission::APPROVE_CLOSURE
        ]
    ),
    Permission.new(
        resource: Permission::INCIDENT,
        actions: [
            Permission::READ,
            Permission::FLAG,
            Permission::EXPORT_JSON,
            Permission::IMPORT,
            Permission::ASSIGN
        ]
    ),
    Permission.new(
        resource: Permission::ROLE,
        role_unique_ids: ['role-gbv-caseworker'],
        actions: [
            Permission::READ
        ]
    ),
    Permission.new(
        resource: Permission::USER,
        actions: [
            Permission::READ
        ]
    ),
    Permission.new(
        resource: Permission::USER_GROUP,
        actions: [
            Permission::READ
        ]
    ),
    Permission.new(
        resource: Permission::REPORT,
        actions: [
            Permission::GROUP_READ,
            Permission::WRITE
        ]
    )
]

create_or_update_role(
    unique_id: "role-gbv-case-management-supervisor",
    name: "GBV Case Management Supervisor",
    group_permission: Permission::GROUP,
    permissions: gbv_cm_supervisor_permissions,
    form_sections: FormSection.where(unique_id: gbv_cm_supervisor_forms),
    modules: [ PrimeroModule.gbv ]
)

gbv_program_manager_forms = [
    "action_plan_form", "gbv_case_closure_form", "consent_for_referrals", "other_documents", "record_owner", "referral_transfer",
    "safety_plan", "survivor_assessment_form", "gbv_survivor_information", "alleged_perpetrators_wrapper", "gbv_incident_form",
    "gbv_individual_details", "other_reportable_fields_incident", "incident_record_owner", "incident_service_referrals",
    "gbv_sexual_violence", "action_plan_subform_section", "gbv_follow_up_subform_section", "reopened_logs", "transitions",
    "alleged_perpetrator", "health_medical_referral_subform_section", "psychosocial_counseling_services_subform_section",
    "legal_assistance_services_subform_section", "police_or_other_type_of_security_services_subform_section",
    "livelihoods_services_subform_section", "child_protection_services_subform_section", "gbv_reported_elsewhere_subform"
]

gbv_program_manager_permissions = [
    Permission.new(
        resource: Permission::ROLE,
        actions: [
            Permission::READ
        ]
    ),
    Permission.new(
        resource: Permission::USER,
        actions: [
            Permission::READ
        ]
    ),
    Permission.new(
        resource: Permission::USER_GROUP,
        actions: [
            Permission::READ
        ]
    ),
    Permission.new(
        resource: Permission::REPORT,
        actions: [
            Permission::GROUP_READ,
            Permission::WRITE
        ]
    )
]

create_or_update_role(
    unique_id: "role-gbv-program-manager",
    name: "GBV Program Manager",
    group_permission: Permission::ALL,
    permissions: gbv_program_manager_permissions,
    form_sections: FormSection.where(unique_id: gbv_program_manager_forms),
    modules: [ PrimeroModule.gbv ]
)

gbv_organization_focal_point_forms = [
    "action_plan_form", "gbv_case_closure_form", "consent_for_referrals", "other_documents", "record_owner", "referral_transfer",
    "safety_plan", "survivor_assessment_form", "gbv_survivor_information", "alleged_perpetrators_wrapper", "gbv_incident_form",
    "gbv_individual_details", "incident_record_owner", "incident_service_referrals", "gbv_sexual_violence",
    "action_plan_subform_section", "gbv_follow_up_subform_section", "reopened_logs", "transitions", "alleged_perpetrator",
    "health_medical_referral_subform_section", "psychosocial_counseling_services_subform_section",
    "legal_assistance_services_subform_section", "police_or_other_type_of_security_services_subform_section",
    "livelihoods_services_subform_section", "child_protection_services_subform_section", "gbv_reported_elsewhere_subform"
]

gbv_organization_focal_point_permissions = [
    Permission.new(
        resource: Permission::CASE,
        actions: [
            Permission::READ,
            Permission::FLAG,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_PDF,
            Permission::EXPORT_JSON,
            Permission::IMPORT,
            Permission::ASSIGN,
            Permission::CONSENT_OVERRIDE,
            Permission::SYNC_MOBILE
        ]
    ),
    Permission.new(
        resource: Permission::INCIDENT,
        actions: [
            Permission::READ,
            Permission::FLAG,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_INCIDENT_RECORDER,
            Permission::EXPORT_JSON,
            Permission::EXPORT_CUSTOM,
            Permission::IMPORT
        ]
    ),
    Permission.new(
        resource: Permission::ROLE,
        actions: [
            Permission::READ,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON
        ],
        role_unique_ids: ['role-gbv-case-management-supervisor', 'role-gbv-caseworker', 'role-gbv-program-manager']
    ),
    Permission.new(
        resource: Permission::USER,
        actions: [
            Permission::READ,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON
        ]
    ),
    Permission.new(
        resource: Permission::USER_GROUP,
        actions: [
            Permission::READ,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON
        ]
    ),
    Permission.new(
        resource: Permission::REPORT,
        actions: [
            Permission::GROUP_READ,
            Permission::WRITE
        ]
    )
]

create_or_update_role(
    unique_id: "role-gbv-organization-focal-point",
    name: "GBV Organization Focal Point",
    group_permission: Permission::GROUP,
    permissions: gbv_organization_focal_point_permissions,
    form_sections: FormSection.where(unique_id: gbv_organization_focal_point_forms),
    modules: [ PrimeroModule.gbv ]
)

agency_user_admin_permissions = [
    Permission.new(
        resource: Permission::ROLE,
        actions: [
            Permission::READ,
            Permission::ASSIGN
        ],
        role_unique_ids: [
            "role-cp-case-worker",
            "role-cp-manager",
            "role-cp-user-manager",
            "role-cp-administrator"
        ]
    ),
    Permission.new(
        resource: Permission::USER,
        actions: [
            Permission::AGENCY_READ,
            Permission::CREATE,
            Permission::WRITE,
            Permission::ASSIGN,
            Permission::MANAGE
        ]
    ),
    Permission.new(
        resource: Permission::USER_GROUP,
        actions: [
            Permission::READ,
            Permission::CREATE,
            Permission::WRITE,
            Permission::ASSIGN
        ]
    )
]

create_or_update_role(
    unique_id: "role-agency-user-administrator",
    name: "Agency User Administrator",
    permissions: agency_user_admin_permissions,
    group_permission: Permission::GROUP,
    is_manager: true,
    modules: [ PrimeroModule.cp ]
)

gbv_agency_user_admin_permissions = [
  Permission.new(
      resource: Permission::ROLE,
      actions: [
          Permission::READ,
          Permission::ASSIGN
      ],
      role_unique_ids: [
          "role-gbv-case-management-supervisor",
          "role-gbv-caseworker",
          "role-gbv-manager",
          "role-gbv-mobile-caseworker",
          "role-gbv-organization-focal-point",
          "role-gbv-program-manager",
          "role-gbv-social-worker",
          "role-gbv-user-manager"
      ]
  ),
  Permission.new(
      resource: Permission::USER,
      actions: [
          Permission::AGENCY_READ,
          Permission::CREATE,
          Permission::WRITE,
          Permission::ASSIGN,
          Permission::MANAGE
      ]
  ),
  Permission.new(
      resource: Permission::USER_GROUP,
      actions: [
          Permission::READ,
          Permission::CREATE,
          Permission::WRITE,
          Permission::ASSIGN
      ]
  )
]

create_or_update_role(
  unique_id: "role-gbv-agency-user-administrator",
  name: "GBV Agency User Administrator",
  permissions: gbv_agency_user_admin_permissions,
  group_permission: Permission::GROUP,
  is_manager: true,
  modules: [ PrimeroModule.gbv ]
)

gbv_system_admin_forms = [
  'incident_service_referrals', 'incident_record_owner', 'gbv_sexual_violence', 'gbv_individual_details', 'gbv_incident_form',
  'alleged_perpetrators_wrapper', 'gbv_survivor_information', 'survivor_assessment_form', 'safety_plan', 'referral_transfer',
  'record_owner', 'other_documents', 'gbv_case_closure_form', 'followup', 'action_plan_form', 'client_feedback'
]

gbv_system_admin_permissions = [
  Permission.new(
    resource: Permission::CASE,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::FLAG,
      Permission::CREATE,
      Permission::INCIDENT_FROM_CASE,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_UNHCR,
      Permission::EXPORT_PDF,
      Permission::EXPORT_JSON,
      Permission::EXPORT_CUSTOM,
      Permission::IMPORT,
      Permission::ASSIGN,
      Permission::TRANSFER,
      Permission::REFERRAL,
      Permission::CONSENT_OVERRIDE,
      Permission::SYNC_MOBILE,
      Permission::REQUEST_APPROVAL_CASE_PLAN,
      Permission::REQUEST_APPROVAL_CLOSURE,
      Permission::APPROVE_CASE_PLAN,
      Permission::APPROVE_CLOSURE
    ]
  ),
  Permission.new(
    resource: Permission::INCIDENT,
    actions: [
      Permission::READ,
      Permission::CREATE,
      Permission::WRITE,
      Permission::FLAG,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_UNHCR,
      Permission::EXPORT_INCIDENT_RECORDER,
      Permission::EXPORT_JSON,
      Permission::EXPORT_CUSTOM,
      Permission::IMPORT,
      Permission::ASSIGN,
      Permission::SYNC_MOBILE,
      Permission::REQUEST_APPROVAL_CASE_PLAN,
      Permission::REQUEST_APPROVAL_CLOSURE
    ]
  ),
  Permission.new(
    resource: Permission::ROLE,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE,
      Permission::ASSIGN
    ],
    role_unique_ids: [
      'role-gbv-manager',
      'role-gbv-social-worker',
      'role-gbv-user-manager'
    ]
  ),
  Permission.new(
    resource: Permission::USER,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE,
      Permission::ASSIGN
    ]
  ),
  Permission.new(
    resource: Permission::USER_GROUP,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE,
      Permission::ASSIGN
    ]
  ),
  Permission.new(
    resource: Permission::AGENCY,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE,
      Permission::ASSIGN
    ]
  ),
  Permission.new(
    resource: Permission::METADATA,
    actions: [Permission::MANAGE]
  ),
  Permission.new(
    resource: Permission::SYSTEM,
    actions: [Permission::MANAGE]
  ),
  Permission.new(
    resource: Permission::REPORT,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE
    ]
  )
]

create_or_update_role(
  unique_id: "role-gbv-system-administrator",
  name: "GBV System Administrator",
  group_permission: Permission::ALL,
  permissions: gbv_system_admin_permissions,
  form_sections: FormSection.where(unique_id: gbv_system_admin_forms),
  is_manager: true,
  modules: [ PrimeroModule.gbv ]
)

referral_permissions = [
  Permission.new(
    resource: Permission::CASE,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::FLAG,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_UNHCR,
      Permission::CREATE,
      Permission::VIEW_PROTECTION_CONCERNS_FILTER
    ]
  )
]

create_or_update_role(
  unique_id: "role-referral",
  name: "Referral",
  permissions: referral_permissions,
  referral: true,
  modules: [ PrimeroModule.cp ]
)

transfer_permissions = [
  Permission.new(
    resource: Permission::CASE,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::FLAG,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_UNHCR,
      Permission::CREATE,
      Permission::VIEW_PROTECTION_CONCERNS_FILTER
    ]
  )
]

create_or_update_role(
  unique_id: "role-transfer",
  name: "Transfer",
  permissions: transfer_permissions,
  transfer: true,
  modules: [ PrimeroModule.cp ]
)

ftr_manager_permissions = [
  Permission.new(
      resource: Permission::CASE,
      actions: [
          Permission::READ,
          Permission::WRITE,
          Permission::FLAG,
          Permission::EXPORT_LIST_VIEW,
          Permission::EXPORT_CSV,
          Permission::EXPORT_EXCEL,
          Permission::EXPORT_JSON,
          Permission::EXPORT_PHOTO_WALL,
          Permission::EXPORT_PDF,
          Permission::EXPORT_UNHCR,
          Permission::SYNC_MOBILE,
          Permission::CREATE,
          Permission::VIEW_PROTECTION_CONCERNS_FILTER,
          Permission::FIND_TRACING_MATCH
      ]
  ),
  Permission.new(
      resource: Permission::TRACING_REQUEST,
      actions: [
          Permission::READ,
          Permission::WRITE,
          Permission::FLAG,
          Permission::EXPORT_LIST_VIEW,
          Permission::EXPORT_CSV,
          Permission::EXPORT_EXCEL,
          Permission::EXPORT_JSON,
          Permission::EXPORT_PHOTO_WALL,
          Permission::EXPORT_PDF,
          Permission::EXPORT_UNHCR,
          Permission::CREATE
      ]
  ),
  Permission.new(
    resource: Permission::POTENTIAL_MATCH,
    actions: [
      Permission::READ
    ]
  ),
  Permission.new(
    resource: Permission::DUPLICATE,
    actions: [Permission::READ]
  ),
  Permission.new(
    resource: Permission::INCIDENT,
    actions: [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE
    ]
  )
]

create_or_update_role(
    unique_id: "role-ftr-manager",
    name: "FTR Manager",
    permissions: ftr_manager_permissions,
    is_manager: true,
    modules: [ PrimeroModule.cp ]
)

superuser_permissions = [
  Permission.new(
    resource: Permission::CASE,
    actions: [Permission::MANAGE]
  ),
  Permission.new(
    resource: Permission::INCIDENT,
    actions: [Permission::MANAGE]
  ),
  Permission.new(
    resource: Permission::TRACING_REQUEST,
    actions: [Permission::MANAGE]
  ),
  Permission.new(
    resource: Permission::POTENTIAL_MATCH,
    actions: [Permission::READ]
  ),
  Permission.new(
    resource: Permission::DUPLICATE,
    actions: [Permission::READ]
  ),
  Permission.new(
    resource: Permission::REPORT,
    actions: [Permission::MANAGE]
  ),
  Permission.new(
    resource: Permission::ROLE,
    actions: [Permission::MANAGE]
  ),
  Permission.new(
    resource: Permission::USER,
    actions: [Permission::MANAGE]
  ),
  Permission.new(
      resource: Permission::USER_GROUP,
      actions: [Permission::MANAGE]
  ),
  Permission.new(
      resource: Permission::AGENCY,
      actions: [Permission::MANAGE]
  ),
  Permission.new(
    resource: Permission::METADATA,
    actions: [Permission::MANAGE]
  ),
  Permission.new(
    resource: Permission::SYSTEM,
    actions: [Permission::MANAGE]
  ),
  Permission.new(
      resource: Permission::AUDIT_LOG,
      actions: [Permission::MANAGE]
  ),
  Permission.new(
      resource: Permission::MATCHING_CONFIGURATION,
      actions: [Permission::MANAGE]
  ),
  #TODO: Remove later when we enabled login for cp users
  Permission.new(
    resource: Permission::DASHBOARD,
    actions: [
      # Permission::VIEW_APPROVALS,
      # Permission::VIEW_RESPONSE,
      Permission::DASH_CASE_RISK,
      # Permission::VIEW_PROTECTION_CONCERNS_FILTER,
      Permission::DASH_PROTECTION_CONCERNS,
      Permission::DASH_TASKS
    ]
  )
]

create_or_update_role(
  unique_id: 'role-superuser',
  name: 'Superuser',
  permissions: superuser_permissions,
  group_permission: Permission::ALL,
  is_manager: true,
  modules: PrimeroModule.all
)
