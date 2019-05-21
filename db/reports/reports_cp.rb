#To generate the UUID, run the following in the rails consle:
#    UUIDTools::UUID.random_create.to_s.gsub('-','')

default_case_filters = [
  {'attribute' => 'child_status', 'value' => [Record::STATUS_OPEN]},
  {'attribute' => 'record_state', 'value' => ['true']}
]

Report.create_or_update({
  id: '9fed7861bef14ec9ab51b41d6555319a',
  name: 'Registration',
  description: 'Case registrations over time',
  module_ids: [PrimeroModule::CP, PrimeroModule::GBV],
  record_type: 'case',
  aggregate_by: ['registration_date'],
  group_dates_by: 'month',
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

#TODO: This doesn't account for referrals
Report.create_or_update({
  id: 'c48322c93cda42f684de9e5812b4869f',
  name: 'Caseload Summary',
  description: 'Number of cases for each case worker',
  module_ids: [PrimeroModule::CP, PrimeroModule::GBV],
  record_type: 'case',
  aggregate_by: ['owned_by'],
  filters: default_case_filters,
  is_graph: true,
  editable: false,
  exclude_empty_rows: true
})

Report.create_or_update({
  id: 'fe317f0481350f116dd1b5d19c974e69',
  name: 'Case status by case worker',
  description: 'Status of cases held by case workers',
  module_ids: [PrimeroModule::CP, PrimeroModule::GBV],
  record_type: 'case',
  aggregate_by: ['owned_by'],
  disaggregate_by: ['child_status'],
  filters: [{'attribute' => 'record_state', 'value' => ['true']}],
  is_graph: true,
  editable: false,
  exclude_empty_rows: true
})

Report.create_or_update({
  id: '957ade8094074ebd8b9a94baaa07d1ab',
  name: 'Cases by Agency',
  description: 'Number of cases broken down by agency',
  module_ids: [PrimeroModule::CP, PrimeroModule::GBV],
  record_type: 'case',
  aggregate_by: ['owned_by_agency'],
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

Report.create_or_update({
  id: '1b00e72e20d5419083b9ef06fd4c2705',
  name: 'Cases by Nationality',
  description: 'Number of cases broken down by nationality',
  module_ids: [PrimeroModule::CP],
  record_type: 'case',
  aggregate_by: ['nationality'],
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

Report.create_or_update({
  id: '4102c67d9c964cd6b3d27eea6cad8b1f',
  name: 'Cases by Age and Sex',
  description: 'Number of cases broken down by age and sex',
  module_ids: [PrimeroModule::CP],
  record_type: 'case',
  aggregate_by: ['age'],
  disaggregate_by: ['sex'],
  group_ages: true,
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

Report.create_or_update({
  id: '2336b8190963441587fc3d84351fb043',
  name: 'Cases by Protection Concern',
  description: 'Number of cases broken down by protection concern and sex',
  module_ids: [PrimeroModule::CP],
  record_type: 'case',
  aggregate_by: ['protection_concerns'],
  disaggregate_by: ['sex'],
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

Report.create_or_update({
  id: 'fdd89b21d49c44489e4ce147c62ae3fb',
  name: 'Current Care Arrangements',
  description: 'The care arrangements broken down by age and sex',
  module_ids: [PrimeroModule::CP],
  record_type: 'case',
  aggregate_by: ['care_arrangements_type'],
  disaggregate_by: ['sex', 'age'],
  group_ages: true,
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

Report.create_or_update({
  id: 'c2422c9ff40e432aa7c97653dc67d9b7',
  name: 'Workflow Status',
  description: 'Cases broken down by current workflow status',
  module_ids: [PrimeroModule::CP],
  record_type: 'case',
  aggregate_by: ['workflow_status'],
  group_ages: true,
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

Report.create_or_update(
  name: "Follow up by month by Agency",
  description: "Number of followups broken down by month and agency",
  module_ids: [ PrimeroModule::CP ],
  record_type: "reportable_follow_up",
  aggregate_by: [ "followup_date" ],
  disaggregate_by: ["owned_by_agency"],
  filters: [
    {
      "attribute": "child_status",
      "value": [
        "Open"
      ]
    },
    {
      "attribute": "record_state",
      "value": [
        "true"
      ]
    },
    {
      "attribute": "followup_date",
      "value": [
        "not_null"
      ]
    }
  ],
  group_ages: false,
  group_dates_by: "month",
  is_graph: true,
  editable: false,
)

Report.create_or_update(
  name: "Follow up by week by Agency",
  description: "Number of followups broken down by week and agency",
  module_ids: [ PrimeroModule::CP ],
  record_type: "reportable_follow_up",
  aggregate_by: [ "followup_date" ],
  disaggregate_by: ["owned_by_agency"],
  filters: [
    {
      "attribute": "child_status",
      "value": [
        "Open"
      ]
    },
    {
      "attribute": "record_state",
      "value": [
        "true"
      ]
    },
    {
      "attribute": "followup_date",
      "value": [
        "not_null"
      ]
    }
  ],
  group_ages: false,
  group_dates_by: "week",
  is_graph: true,
  editable: false,
)

Report.create_or_update({
  id: '85e5bf5c90cd44a48bccb69410f0e466',
  name: 'Cases with case plans',
  description: 'How many registered cases have case plans?',
  module_ids: [PrimeroModule::CP],
  record_type: 'case',
  aggregate_by: ['has_case_plan'],
  group_ages: false,
  group_dates_by: 'date',
  filters: default_case_filters,
  is_graph: false,
  editable: false
})
