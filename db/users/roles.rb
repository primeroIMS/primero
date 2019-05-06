def create_or_update_role(role_hash)
  role_id = Role.id_from_name role_hash[:name]
  role = Role.get role_id

  if role.nil?
    puts "Creating role #{role_id}"
    Role.create! role_hash
  else
    puts "Updating role #{role_id}"
    role.update_attributes role_hash
  end

end

cp_admin_permissions = [
  Permission.new(
    :resource => Permission::CASE,
    :actions => [
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
      Permission::EXPORT_CASE_PDF,
      Permission::EXPORT_UNHCR,
      Permission::SEARCH_OWNED_BY_OTHERS,
      Permission::CREATE,
      Permission::VIEW_PROTECTION_CONCERNS_FILTER,
      Permission::ENABLE_DISABLE_RECORD
    ]
  ),
  Permission.new(
    :resource => Permission::TRACING_REQUEST,
    :actions => [
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
      Permission::EXPORT_PDF,
      Permission::EXPORT_UNHCR,
      Permission::CREATE
    ]
  ),
  Permission.new(
    :resource => Permission::ROLE,
    :actions => [
      Permission::READ,
      Permission::WRITE,
      Permission::ASSIGN,
      Permission::IMPORT,
      Permission::EXPORT_CUSTOM,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PDF,
      Permission::CREATE
    ],
    :role_ids => [
      'role-cp-case-worker',
      'role-cp-manager',
      'role-cp-user-manager',
      'role-referral',
      'role-transfer'
    ]
  ),
  Permission.new(
    :resource => Permission::USER,
    :actions => [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE
    ]
  ),
  Permission.new(
      :resource => Permission::USER_GROUP,
      :actions => [
          Permission::READ,
          Permission::WRITE,
          Permission::CREATE,
          Permission::ASSIGN
      ]
  ),
  Permission.new(
      :resource => Permission::AGENCY,
      :actions => [
          Permission::READ,
          Permission::WRITE,
          Permission::CREATE
      ]
  ),
  Permission.new(
    :resource => Permission::REPORT,
    :actions => [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE
    ]
  ),
  Permission.new(
    :resource => Permission::METADATA,
    :actions => [Permission::MANAGE]
  ),
  Permission.new(
    :resource => Permission::SYSTEM,
    :actions => [Permission::MANAGE]
  ),
  Permission.new(
    :resource => Permission::INCIDENT,
    :actions => [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE
    ]
  )
]

create_or_update_role(
  :name => "CP Administrator",
  :permissions_list => cp_admin_permissions,
  :group_permission => Permission::ALL
)


cp_caseworker_permissions = [
  Permission.new(
    :resource => Permission::CASE,
    :actions => [
      Permission::READ,
      Permission::WRITE,
      Permission::FLAG,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_CASE_PDF,
      Permission::EXPORT_UNHCR,
      Permission::SYNC_MOBILE,
      Permission::REQUEST_APPROVAL_CASE_PLAN,
      Permission::SEARCH_OWNED_BY_OTHERS,
      Permission::INCIDENT_FROM_CASE,
      Permission::CREATE,
      Permission::REFERRAL_FROM_SERVICE,
      Permission::REFERRAL,
      Permission::VIEW_PROTECTION_CONCERNS_FILTER,
      Permission::REMOVE_ASSIGNED_USERS,
      Permission::ENABLE_DISABLE_RECORD
    ]
  ),
  Permission.new(
    :resource => Permission::TRACING_REQUEST,
    :actions => [
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
    :resource => Permission::POTENTIAL_MATCH,
    :actions => [
      Permission::READ
    ]
  ),
  Permission.new(
    :resource => Permission::DASHBOARD,
    :actions => [
      Permission::VIEW_APPROVALS,
      Permission::VIEW_RESPONSE,
      Permission::VIEW_ASSESSMENT,
      Permission::VIEW_PROTECTION_CONCERNS_FILTER,
      Permission::DASH_TASKS
    ]
  ),
  Permission.new(
    :resource => Permission::INCIDENT,
    :actions => [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE
    ]
  )
]

create_or_update_role(
  :name => "CP Case Worker",
  :permissions_list => cp_caseworker_permissions
)

cp_manager_permissions = [
  Permission.new(
    :resource => Permission::CASE,
    :actions => [
      Permission::READ,
      Permission::FLAG,
      Permission::ASSIGN,
      Permission::REASSIGN,
      Permission::CONSENT_OVERRIDE,
      Permission::EXPORT_CUSTOM,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_CASE_PDF,
      Permission::EXPORT_UNHCR,
      Permission::SYNC_MOBILE,
      Permission::APPROVE_CASE_PLAN,
      Permission::SEARCH_OWNED_BY_OTHERS,
      Permission::INCIDENT_FROM_CASE,
      Permission::VIEW_PROTECTION_CONCERNS_FILTER,
      Permission::ENABLE_DISABLE_RECORD
    ]
  ),
  Permission.new(
    :resource => Permission::TRACING_REQUEST,
    :actions => [
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
    :resource => Permission::POTENTIAL_MATCH,
    :actions => [
      Permission::READ
    ]
  ),
  Permission.new(
    :resource => Permission::REPORT,
    :actions => [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE
    ]
  ),
  Permission.new(
    :resource => Permission::ROLE,
    :actions => [
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
    :resource => Permission::USER,
    :actions => [
      Permission::READ
    ]
  ),
  Permission.new(
      :resource => Permission::USER_GROUP,
      :actions => [
          Permission::READ
      ]
  ),
  Permission.new(
      :resource => Permission::AGENCY,
      :actions => [
          Permission::READ
      ]
  ),
  Permission.new(
      :resource => Permission::DASHBOARD,
      :actions => [
        Permission::VIEW_APPROVALS,
        Permission::VIEW_RESPONSE,
        Permission::VIEW_ASSESSMENT,
        Permission::VIEW_PROTECTION_CONCERNS_FILTER,
        Permission::DASH_CASES_BY_TASK_OVERDUE
      ]
  )
]

create_or_update_role(
  :name => "CP Manager",
  :permissions_list => cp_manager_permissions,
  :group_permission => Permission::GROUP
)

cp_user_manager_permissions = [
    Permission.new(
        :resource => Permission::CASE,
        :actions => [
            Permission::READ,
            Permission::FLAG,
            Permission::ASSIGN,
            Permission::REASSIGN,
            Permission::CONSENT_OVERRIDE,
            Permission::EXPORT_CUSTOM,
            Permission::EXPORT_LIST_VIEW,
            Permission::EXPORT_CSV,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON,
            Permission::EXPORT_PHOTO_WALL,
            Permission::EXPORT_PDF,
            Permission::EXPORT_CASE_PDF,
            Permission::EXPORT_UNHCR,
            Permission::SYNC_MOBILE,
            Permission::APPROVE_CASE_PLAN,
            Permission::VIEW_PROTECTION_CONCERNS_FILTER
        ]
    ),
    Permission.new(
        :resource => Permission::TRACING_REQUEST,
        :actions => [
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
        :resource => Permission::POTENTIAL_MATCH,
        :actions => [
            Permission::READ
        ]
    ),
    Permission.new(
        :resource => Permission::REPORT,
        :actions => [
            Permission::READ,
            Permission::WRITE
        ]
    ),
    Permission.new(
        :resource => Permission::ROLE,
        :actions => [
            Permission::READ,
            Permission::ASSIGN,
            Permission::EXPORT_CUSTOM,
            Permission::EXPORT_LIST_VIEW,
            Permission::EXPORT_CSV,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON,
            Permission::EXPORT_PDF
        ]
    ),
    Permission.new(
        :resource => Permission::USER,
        :actions => [
            Permission::READ,
            Permission::CREATE,
            Permission::WRITE
        ]
    ),
    Permission.new(
        :resource => Permission::USER_GROUP,
        :actions => [
            Permission::READ,
            Permission::CREATE,
            Permission::WRITE,
            Permission::ASSIGN
        ]
    ),
    Permission.new(
        :resource => Permission::AGENCY,
        :actions => [
            Permission::READ,
            Permission::CREATE,
            Permission::WRITE
        ]
    ),
    Permission.new(
        :resource => Permission::DASHBOARD,
        :actions => [
          Permission::VIEW_APPROVALS,
          Permission::VIEW_RESPONSE,
          Permission::VIEW_ASSESSMENT,
          Permission::VIEW_PROTECTION_CONCERNS_FILTER
        ]
    )
]

create_or_update_role(
    :name => "CP User Manager",
    :permissions_list => cp_user_manager_permissions,
    :group_permission => Permission::GROUP
)

gbv_worker_permissions = [
  Permission.new(
    :resource => Permission::CASE,
    :actions => [
      Permission::READ,
      Permission::WRITE,
      Permission::FLAG,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_CASE_PDF,
      Permission::EXPORT_UNHCR,
      Permission::SYNC_MOBILE,
      Permission::INCIDENT_FROM_CASE,
      Permission::CREATE,
      Permission::VIEW_PROTECTION_CONCERNS_FILTER,
      Permission::ENABLE_DISABLE_RECORD
    ]
  ),
  Permission.new(
    :resource => Permission::INCIDENT,
    :actions => [
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
        :resource => Permission::DASHBOARD,
        :actions => [
            Permission::VIEW_ASSESSMENT
        ]
    )
]

create_or_update_role(
  :name => "GBV Social Worker",
  :permissions_list => gbv_worker_permissions
)

gbv_manager_permissions = [
  Permission.new(
    :resource => Permission::CASE,
    :actions => [
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
      Permission::EXPORT_CASE_PDF,
      Permission::EXPORT_UNHCR,
      Permission::SYNC_MOBILE,
      Permission::VIEW_PROTECTION_CONCERNS_FILTER,
      Permission::REMOVE_ASSIGNED_USERS,
      Permission::ENABLE_DISABLE_RECORD
    ]
  ),
  Permission.new(
    :resource => Permission::INCIDENT,
    :actions => [
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
    :resource => Permission::REPORT,
    :actions => [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE
    ]
  ),
  Permission.new(
    :resource => Permission::ROLE,
    :actions => [
      Permission::READ,
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
    :resource => Permission::USER,
    :actions => [
      Permission::READ
    ]
  ),
  Permission.new(
      :resource => Permission::USER_GROUP,
      :actions => [
          Permission::READ
      ]
  ),
  Permission.new(
      :resource => Permission::AGENCY,
      :actions => [
          Permission::READ
      ]
  ),
  Permission.new(
    :resource => Permission::DASHBOARD,
    :actions => [
      Permission::DASH_REFFERALS_BY_SOCIAL_WORKER
    ]
  )
]

create_or_update_role(
    :name => "GBV Manager",
    :permissions_list => gbv_manager_permissions,
    :group_permission => Permission::GROUP
)

gbv_user_manager_permissions = [
    Permission.new(
        :resource => Permission::CASE,
        :actions => [
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
            Permission::EXPORT_CASE_PDF,
            Permission::EXPORT_UNHCR,
            Permission::SYNC_MOBILE,
            Permission::VIEW_PROTECTION_CONCERNS_FILTER
        ]
    ),
    Permission.new(
        :resource => Permission::INCIDENT,
        :actions => [
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
        :resource => Permission::REPORT,
        :actions => [
            Permission::READ,
            Permission::WRITE
        ]
    ),
    Permission.new(
        :resource => Permission::ROLE,
        :actions => [
            Permission::READ,
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
        :resource => Permission::USER,
        :actions => [
            Permission::READ,
            Permission::CREATE,
            Permission::WRITE
        ]
    ),
    Permission.new(
        :resource => Permission::USER_GROUP,
        :actions => [
            Permission::READ,
            Permission::CREATE,
            Permission::WRITE,
            Permission::ASSIGN
        ]
    ),
    Permission.new(
        :resource => Permission::AGENCY,
        :actions => [
            Permission::READ,
            Permission::CREATE,
            Permission::WRITE
        ]
    )
]

create_or_update_role(
    :name => "GBV User Manager",
    :permissions_list => gbv_user_manager_permissions,
    :group_permission => Permission::GROUP
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
        :resource => Permission::CASE,
        :actions => [
            Permission::READ,
            Permission::WRITE,
            Permission::FLAG,
            Permission::CONSENT_OVERRIDE,
            Permission::EXPORT_CASE_PDF,
            Permission::REQUEST_APPROVAL_CASE_PLAN,
            Permission::REQUEST_APPROVAL_BIA,
            Permission::REQUEST_APPROVAL_CLOSURE
        ]
    ),
    Permission.new(
        :resource => Permission::INCIDENT,
        :actions => [
            Permission::READ,
            Permission::WRITE,
            Permission::FLAG
        ]
    ),
    Permission.new(
        :resource => Permission::DASHBOARD,
        :actions => [
            Permission::VIEW_ASSESSMENT
        ]
    )
]

create_or_update_role(
    :name => "GBV Caseworker",
    :permissions_list => gbv_caseworker_permissions,
    :permitted_form_ids => gbv_caseworker_forms,
    :referral => false,
    :transfer => false
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
        :resource => Permission::CASE,
        :actions => [
            Permission::READ,
            Permission::WRITE,
            Permission::FLAG,
            Permission::CONSENT_OVERRIDE,
            Permission::EXPORT_CASE_PDF,
            Permission::REQUEST_APPROVAL_CASE_PLAN,
            Permission::REQUEST_APPROVAL_BIA,
            Permission::REQUEST_APPROVAL_CLOSURE,
            Permission::SYNC_MOBILE
        ]
    ),
    Permission.new(
        :resource => Permission::INCIDENT,
        :actions => [
            Permission::READ,
            Permission::WRITE,
            Permission::FLAG,
            Permission::SYNC_MOBILE
        ]
    )
]

create_or_update_role(
    :name => "GBV Mobile Caseworker",
    :permissions_list => gbv_mobile_caseworker_permissions,
    :permitted_form_ids => gbv_mobile_caseworker_forms,
    :referral => false,
    :transfer => false
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
        :resource => Permission::CASE,
        :actions => [
            Permission::READ,
            Permission::FLAG,
            Permission::ASSIGN,
            Permission::REASSIGN,
            Permission::EXPORT_JSON,
            Permission::EXPORT_CASE_PDF,
            Permission::CONSENT_OVERRIDE,
            Permission::EXPORT_CASE_PDF,
            Permission::APPROVE_BIA,
            Permission::APPROVE_CASE_PLAN,
            Permission::APPROVE_CLOSURE
        ]
    ),
    Permission.new(
        :resource => Permission::INCIDENT,
        :actions => [
            Permission::READ,
            Permission::FLAG,
            Permission::EXPORT_JSON,
            Permission::IMPORT,
            Permission::ASSIGN
        ]
    ),
    Permission.new(
        :resource => Permission::ROLE,
        :role_ids => ['role-gbv-caseworker'],
        :actions => [
            Permission::READ
        ]
    ),
    Permission.new(
        :resource => Permission::USER,
        :actions => [
            Permission::READ
        ]
    ),
    Permission.new(
        :resource => Permission::USER_GROUP,
        :actions => [
            Permission::READ
        ]
    ),
    Permission.new(
        :resource => Permission::REPORT,
        :actions => [
            Permission::GROUP_READ,
            Permission::WRITE
        ]
    ),
    Permission.new(
        :resource => Permission::DASHBOARD,
        :actions => [
            Permission::DASH_REFFERALS_BY_SOCIAL_WORKER
        ]
    )

]

create_or_update_role(
    :name => "GBV Case Management Supervisor",
    :group_permission => Permission::GROUP,
    :permissions_list => gbv_cm_supervisor_permissions,
    :permitted_form_ids => gbv_cm_supervisor_forms,
    :referral => false,
    :transfer => false
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
        :resource => Permission::ROLE,
        :actions => [
            Permission::READ
        ]
    ),
    Permission.new(
        :resource => Permission::USER,
        :actions => [
            Permission::READ
        ]
    ),
    Permission.new(
        :resource => Permission::USER_GROUP,
        :actions => [
            Permission::READ
        ]
    ),
    Permission.new(
        :resource => Permission::REPORT,
        :actions => [
            Permission::GROUP_READ,
            Permission::WRITE
        ]
    )
]

create_or_update_role(
    :name => "GBV Program Manager",
    :group_permission => Permission::ALL,
    :permissions_list => gbv_program_manager_permissions,
    :permitted_form_ids => gbv_program_manager_forms
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
        :resource => Permission::CASE,
        :actions => [
            Permission::READ,
            Permission::FLAG,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_PDF,
            Permission::EXPORT_CASE_PDF,
            Permission::EXPORT_JSON,
            Permission::IMPORT,
            Permission::ASSIGN,
            Permission::REASSIGN,
            Permission::CONSENT_OVERRIDE,
            Permission::SYNC_MOBILE
        ]
    ),
    Permission.new(
        :resource => Permission::INCIDENT,
        :actions => [
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
        :resource => Permission::ROLE,
        :actions => [
            Permission::READ,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_PDF,
            Permission::EXPORT_JSON
        ],
        :role_ids => ['role-gbv-case-management-supervisor', 'role-gbv-caseworker', 'role-gbv-program-manager']
    ),
    Permission.new(
        :resource => Permission::USER,
        :actions => [
            Permission::READ,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_PDF,
            Permission::EXPORT_JSON
        ]
    ),
    Permission.new(
        :resource => Permission::USER_GROUP,
        :actions => [
            Permission::READ,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_PDF,
            Permission::EXPORT_JSON
        ]
    ),
    Permission.new(
        :resource => Permission::REPORT,
        :actions => [
            Permission::GROUP_READ,
            Permission::WRITE
        ]
    )
]

create_or_update_role(
    :name => "GBV Organization Focal Point",
    :group_permission => Permission::GROUP,
    :permissions_list => gbv_organization_focal_point_permissions,
    :permitted_form_ids => gbv_organization_focal_point_forms,
    :referral => false,
    :transfer => false
)

agency_user_admin_permissions = [
    Permission.new(
        :resource => Permission::ROLE,
        :actions => [
            Permission::READ,
            Permission::ASSIGN
        ],
        :role_ids => [
            "role-cp-case-worker",
            "role-cp-manager",
            "role-cp-user-manager",
            "role-cp-administrator"
        ]
    ),
    Permission.new(
        :resource => Permission::USER,
        :actions => [
            Permission::AGENCY_READ,
            Permission::CREATE,
            Permission::WRITE,
            Permission::ASSIGN,
            Permission::MANAGE
        ]
    ),
    Permission.new(
        :resource => Permission::USER_GROUP,
        :actions => [
            Permission::READ,
            Permission::CREATE,
            Permission::WRITE,
            Permission::ASSIGN
        ]
    )
]

create_or_update_role(
    :name => "Agency User Administrator",
    :permissions_list => agency_user_admin_permissions,
    :group_permission => Permission::GROUP
)

gbv_agency_user_admin_permissions = [
    Permission.new(
        :resource => Permission::ROLE,
        :actions => [
            Permission::READ,
            Permission::ASSIGN
        ],
        :role_ids => [
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
        :resource => Permission::USER,
        :actions => [
            Permission::AGENCY_READ,
            Permission::CREATE,
            Permission::WRITE,
            Permission::ASSIGN,
            Permission::MANAGE
        ]
    ),
    Permission.new(
        :resource => Permission::USER_GROUP,
        :actions => [
            Permission::READ,
            Permission::CREATE,
            Permission::WRITE,
            Permission::ASSIGN
        ]
    )
]

create_or_update_role(
    :name => "GBV Agency User Administrator",
    :permissions_list => gbv_agency_user_admin_permissions,
    :group_permission => Permission::GROUP
)

referral_permissions = [
  Permission.new(
    :resource => Permission::CASE,
    :actions => [
      Permission::READ,
      Permission::WRITE,
      Permission::FLAG,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_CASE_PDF,
      Permission::EXPORT_UNHCR,
      Permission::CREATE,
      Permission::VIEW_PROTECTION_CONCERNS_FILTER
    ]
  )
]

create_or_update_role(
  :name => "Referral",
  :permissions_list => referral_permissions,
  :referral => true
)

transfer_permissions = [
  Permission.new(
    :resource => Permission::CASE,
    :actions => [
      Permission::READ,
      Permission::WRITE,
      Permission::FLAG,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_CASE_PDF,
      Permission::EXPORT_UNHCR,
      Permission::CREATE,
      Permission::VIEW_PROTECTION_CONCERNS_FILTER
    ]
  )
]

create_or_update_role(
  :name => "Transfer",
  :permissions_list => transfer_permissions,
  :transfer => true
)

ftr_manager_permissions = [
  Permission.new(
      :resource => Permission::CASE,
      :actions => [
          Permission::READ,
          Permission::WRITE,
          Permission::FLAG,
          Permission::EXPORT_LIST_VIEW,
          Permission::EXPORT_CSV,
          Permission::EXPORT_EXCEL,
          Permission::EXPORT_JSON,
          Permission::EXPORT_PHOTO_WALL,
          Permission::EXPORT_PDF,
          Permission::EXPORT_CASE_PDF,
          Permission::EXPORT_UNHCR,
          Permission::SYNC_MOBILE,
          Permission::CREATE,
          Permission::VIEW_PROTECTION_CONCERNS_FILTER
      ]
  ),
  Permission.new(
      :resource => Permission::TRACING_REQUEST,
      :actions => [
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
    :resource => Permission::POTENTIAL_MATCH,
    :actions => [
      Permission::READ
    ]
  ),
  Permission.new(
    :resource => Permission::INCIDENT,
    :actions => [
      Permission::READ,
      Permission::WRITE,
      Permission::CREATE
    ]
  )
]

create_or_update_role(
    :name => "FTR Manager",
    :permissions_list => ftr_manager_permissions
)

superuser_permissions = [
  Permission.new(
    :resource => Permission::CASE,
    :actions => [Permission::MANAGE]
  ),
  Permission.new(
    :resource => Permission::INCIDENT,
    :actions => [Permission::MANAGE]
  ),
  Permission.new(
    :resource => Permission::TRACING_REQUEST,
    :actions => [Permission::MANAGE]
  ),
  Permission.new(
    :resource => Permission::POTENTIAL_MATCH,
    :actions => [Permission::READ]
  ),
  Permission.new(
    :resource => Permission::REPORT,
    :actions => [Permission::MANAGE]
  ),
  Permission.new(
    :resource => Permission::ROLE,
    :actions => [Permission::MANAGE]
  ),
  Permission.new(
    :resource => Permission::USER,
    :actions => [Permission::MANAGE]
  ),
  Permission.new(
      :resource => Permission::USER_GROUP,
      :actions => [Permission::MANAGE]
  ),
  Permission.new(
      :resource => Permission::AGENCY,
      :actions => [Permission::MANAGE]
  ),
  Permission.new(
    :resource => Permission::METADATA,
    :actions => [Permission::MANAGE]
  ),
  Permission.new(
    :resource => Permission::SYSTEM,
    :actions => [Permission::MANAGE]
  )
]

create_or_update_role(
  :name => "Superuser",
  :permissions_list => superuser_permissions,
  :group_permission => Permission::ALL
)
