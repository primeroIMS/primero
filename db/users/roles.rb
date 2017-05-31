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
      Permission::EXPORT_UNHCR
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
      Permission::EXPORT_UNHCR
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
      Permission::EXPORT_PDF
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
      Permission::IMPORT,
      Permission::EXPORT_CUSTOM,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PDF
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
    :resource => Permission::METADATA,
    :actions => [Permission::MANAGE]
  ),
  Permission.new(
    :resource => Permission::SYSTEM,
    :actions => [Permission::MANAGE]
  )
]

# create_or_update_role(
#   :name => "CP Administrator",
#   :permissions_list => cp_admin_permissions,
#   :group_permission => Permission::ALL
# )


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
      Permission::REQUEST_APPROVAL_CASE_PLAN
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
      Permission::EXPORT_UNHCR
    ]
  ),
  Permission.new(
    :resource => Permission::DASHBOARD,
    :actions => [
      Permission::VIEW_APPROVALS,
      Permission::VIEW_ASSESSMENT
    ]
  )
]

# create_or_update_role(
#   :name => "CP Case Worker",
#   :permissions_list => cp_caseworker_permissions
# )

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
      Permission::APPROVE_CASE_PLAN
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
      Permission::EXPORT_CUSTOM,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PDF
    ]
  ),
  Permission.new(
    :resource => Permission::DASHBOARD,
    :actions => [
      Permission::VIEW_APPROVALS,
      Permission::VIEW_ASSESSMENT
    ]
  )
]

# create_or_update_role(
#   :name => "CP Manager",
#   :permissions_list => cp_manager_permissions,
#   :group_permission => Permission::GROUP
# )

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
            Permission::APPROVE_CASE_PLAN
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
            Permission::WRITE,
            Permission::EXPORT_CUSTOM,
            Permission::EXPORT_LIST_VIEW,
            Permission::EXPORT_CSV,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON,
            Permission::EXPORT_PDF
        ]
    ),
    Permission.new(
        :resource => Permission::DASHBOARD,
        :actions => [
            Permission::VIEW_APPROVALS,
            Permission::VIEW_ASSESSMENT
        ]
    )
]

# create_or_update_role(
#   :name => "CP User Manager",
#   :permissions_list => cp_user_manager_permissions,
#   :group_permission => Permission::GROUP
# )

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
      Permission::EXPORT_UNHCR
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
      Permission::EXPORT_INCIDENT_RECORDER
    ]
  )
]

# create_or_update_role(
#   :name => "GBV Social Worker",
#   :permissions_list => gbv_worker_permissions
# )

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
      Permission::EXPORT_UNHCR
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
      Permission::EXPORT_INCIDENT_RECORDER
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
      Permission::EXPORT_CUSTOM,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_UNHCR
    ]
  )
]

# create_or_update_role(
#   :name => "GBV Manager",
#   :permissions_list => gbv_manager_permissions,
#   :group_permission => Permission::GROUP
# )

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
            Permission::EXPORT_UNHCR
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
            Permission::EXPORT_INCIDENT_RECORDER
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
            Permission::WRITE,
            Permission::EXPORT_CUSTOM,
            Permission::EXPORT_LIST_VIEW,
            Permission::EXPORT_CSV,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON,
            Permission::EXPORT_PHOTO_WALL,
            Permission::EXPORT_PDF,
            Permission::EXPORT_UNHCR
        ]
    )
]

# create_or_update_role(
#   :name => "GBV User Manager",
#   :permissions_list => gbv_user_manager_permissions,
#   :group_permission => Permission::GROUP
# )

mrm_monitor_permissions = [
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
      Permission::EXPORT_MRM_VIOLATION_XLS,
      Permission::EXPORT_INCIDENT_RECORDER
    ]
  )
]

create_or_update_role(
  :name => "MRM Monitor",
  :permissions_list => mrm_monitor_permissions
)

mrm_specialist_view_permissions = [
    Permission.new(
        :resource => Permission::INCIDENT,
        :actions => [
            Permission::READ,
            Permission::FLAG,
            Permission::EXPORT_LIST_VIEW,
            Permission::EXPORT_CSV,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON,
            Permission::EXPORT_PHOTO_WALL,
            Permission::EXPORT_PDF,
            Permission::EXPORT_UNHCR,
            Permission::EXPORT_MRM_VIOLATION_XLS,
            Permission::EXPORT_INCIDENT_RECORDER
        ]
    ),
    Permission.new(
        :resource => Permission::REPORT,
        :actions => [
            Permission::READ
        ]
    )
]

create_or_update_role(
    :name => "MRM Specialist (viewing)",
    :permissions_list => mrm_specialist_view_permissions,
    :group_permission => Permission::GROUP
)

mrm_specialist_edit_permissions = [
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
            Permission::EXPORT_MRM_VIOLATION_XLS,
            Permission::EXPORT_INCIDENT_RECORDER
        ]
    ),
    Permission.new(
        :resource => Permission::REPORT,
        :actions => [
            Permission::READ
        ]
    )
]

create_or_update_role(
    :name => "MRM Specialist (editing)",
    :permissions_list => mrm_specialist_edit_permissions,
    :group_permission => Permission::GROUP
)

mrm_co_chair_view_permissions = [
  Permission.new(
    :resource => Permission::INCIDENT,
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
      Permission::EXPORT_UNHCR,
      Permission::EXPORT_MRM_VIOLATION_XLS,
      Permission::EXPORT_INCIDENT_RECORDER
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
      Permission::EXPORT_CUSTOM,
      Permission::EXPORT_LIST_VIEW,
      Permission::EXPORT_CSV,
      Permission::EXPORT_EXCEL,
      Permission::EXPORT_JSON,
      Permission::EXPORT_PHOTO_WALL,
      Permission::EXPORT_PDF,
      Permission::EXPORT_UNHCR
    ]
  )
]

create_or_update_role(
  :name => "MRM Co-chair (viewing)",
  :permissions_list => mrm_co_chair_view_permissions,
  :group_permission => Permission::GROUP
)

mrm_co_chair_edit_permissions = [
    Permission.new(
        :resource => Permission::INCIDENT,
        :actions => [
            Permission::READ,
            Permission::WRITE,
            Permission::FLAG,
            Permission::ASSIGN,
            Permission::EXPORT_CUSTOM,
            Permission::EXPORT_LIST_VIEW,
            Permission::EXPORT_CSV,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON,
            Permission::EXPORT_PHOTO_WALL,
            Permission::EXPORT_PDF,
            Permission::EXPORT_UNHCR,
            Permission::EXPORT_MRM_VIOLATION_XLS,
            Permission::EXPORT_INCIDENT_RECORDER
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
            Permission::EXPORT_CUSTOM,
            Permission::EXPORT_LIST_VIEW,
            Permission::EXPORT_CSV,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON,
            Permission::EXPORT_PHOTO_WALL,
            Permission::EXPORT_PDF,
            Permission::EXPORT_UNHCR
        ]
    )
]

create_or_update_role(
    :name => "MRM Co-chair (editing)",
    :permissions_list => mrm_co_chair_edit_permissions,
    :group_permission => Permission::GROUP
)

mrm_user_manager_permissions = [
    Permission.new(
        :resource => Permission::INCIDENT,
        :actions => [
            Permission::READ,
            Permission::WRITE,
            Permission::FLAG,
            Permission::ASSIGN,
            Permission::EXPORT_CUSTOM,
            Permission::EXPORT_LIST_VIEW,
            Permission::EXPORT_CSV,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON,
            Permission::EXPORT_PHOTO_WALL,
            Permission::EXPORT_PDF,
            Permission::EXPORT_UNHCR,
            Permission::EXPORT_MRM_VIOLATION_XLS,
            Permission::EXPORT_INCIDENT_RECORDER
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
            Permission::WRITE,
            Permission::EXPORT_CUSTOM,
            Permission::EXPORT_LIST_VIEW,
            Permission::EXPORT_CSV,
            Permission::EXPORT_EXCEL,
            Permission::EXPORT_JSON,
            Permission::EXPORT_PHOTO_WALL,
            Permission::EXPORT_PDF,
            Permission::EXPORT_UNHCR
        ]
    )
]

create_or_update_role(
    :name => "MRM User Manager",
    :permissions_list => mrm_user_manager_permissions,
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
      Permission::EXPORT_UNHCR
    ]
  )
]

# create_or_update_role(
#   :name => "Referral",
#   :permissions_list => referral_permissions,
#   :referral => true
# )

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
      Permission::EXPORT_UNHCR
    ]
  )
]

# create_or_update_role(
#   :name => "Transfer",
#   :permissions_list => transfer_permissions,
#   :transfer => true
# )

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

