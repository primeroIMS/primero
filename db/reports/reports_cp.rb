#To generate the UUID, run the following in the rails consle:
#    SecureRandom.uuid.to_s.gsub('-','')
# TODO module_id: It will be numeric after module model migration

default_case_filters = [
  {'attribute' => 'status', 'value' => [Record::STATUS_OPEN]},
  {'attribute' => 'record_state', 'value' => ['true']}
]

Report.create_or_update({
  name_all: 'Registration CP',
  description_all: 'Case registrations over time',
  module_id: PrimeroModule::CP,
  record_type: 'case',
  aggregate_by: ['registration_date'],
  group_dates_by: 'month',
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

Report.create_or_update({
  name_all: 'Registration GBV',
  description_all: 'Case registrations over time',
  module_id: PrimeroModule::GBV,
  record_type: 'case',
  aggregate_by: ['registration_date'],
  group_dates_by: 'month',
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

#TODO: This doesn't account for referrals
Report.create_or_update({
  name_all: 'Caseload Summary CP',
  description_all: 'Number of cases for each case worker',
  module_id: PrimeroModule::CP,
  record_type: 'case',
  aggregate_by: ['owned_by'],
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

Report.create_or_update({
  name_all: 'Caseload Summary GBV',
  description_all: 'Number of cases for each case worker',
  module_id: PrimeroModule::GBV,
  record_type: 'case',
  aggregate_by: ['owned_by'],
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

Report.create_or_update({
  name_all: 'Case status by case worker CP',
  description_all: 'Status of cases held by case workers',
  module_id: PrimeroModule::CP,
  record_type: 'case',
  aggregate_by: ['owned_by'],
  disaggregate_by: ['status'],
  filters: [{'attribute' => 'record_state', 'value' => ['true']}],
  is_graph: true,
  editable: false
})

Report.create_or_update({
  name_all: 'Case status by case worker GBV',
  description_all: 'Status of cases held by case workers',
  module_id: PrimeroModule::GBV,
  record_type: 'case',
  aggregate_by: ['owned_by'],
  disaggregate_by: ['status'],
  filters: [{'attribute' => 'record_state', 'value' => ['true']}],
  is_graph: true,
  editable: false
})

Report.create_or_update({
  name_all: 'Cases by Agency CP',
  description_all: 'Number of cases broken down by agency',
  module_id: PrimeroModule::CP,
  record_type: 'case',
  aggregate_by: ['owned_by_agency_id'],
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

Report.create_or_update({
  name_all: 'Cases by Agency GBV',
  description_all: 'Number of cases broken down by agency',
  module_id: PrimeroModule::GBV,
  record_type: 'case',
  aggregate_by: ['owned_by_agency_id'],
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

Report.create_or_update({
  name_all: 'Cases by Nationality',
  description_all: 'Number of cases broken down by nationality',
  module_id: PrimeroModule::CP,
  record_type: 'case',
  aggregate_by: ['nationality'],
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

Report.create_or_update({
  name_all: 'Cases by Age and Sex',
  description_all: 'Number of cases broken down by age and sex',
  module_id: PrimeroModule::CP,
  record_type: 'case',
  aggregate_by: ['age'],
  disaggregate_by: ['sex'],
  group_ages: true,
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

Report.create_or_update({
  name_all: 'Cases by Protection Concern',
  description_all: 'Number of cases broken down by protection concern and sex',
  module_id: PrimeroModule::CP,
  record_type: 'case',
  aggregate_by: ['protection_concerns'],
  disaggregate_by: ['sex'],
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

Report.create_or_update({
  name_all: 'Current Care Arrangements',
  description_all: 'The care arrangements broken down by age and sex',
  module_id: PrimeroModule::CP,
  record_type: 'case',
  aggregate_by: ['care_arrangements_type'],
  disaggregate_by: ['sex', 'age'],
  group_ages: true,
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

Report.create_or_update({
  name_all: 'Workflow Status',
  description_all: 'Cases broken down by current workflow status',
  module_id: PrimeroModule::CP,
  record_type: 'case',
  aggregate_by: ['workflow_status'],
  group_ages: true,
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

Report.create_or_update(
  name_all: "Follow up by month by Agency",
  description_all: "Number of followups broken down by month and agency",
  module_id:  PrimeroModule::CP,
  record_type: "reportable_follow_up",
  aggregate_by: [ "followup_date" ],
  disaggregate_by: ["owned_by_agency_id"],
  filters: [
    {
      "attribute": "status",
      "value": [
        "open"
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
  name_all: "Follow up by week by Agency",
  description_all: "Number of followups broken down by week and agency",
  module_id:  PrimeroModule::CP,
  record_type: "reportable_follow_up",
  aggregate_by: [ "followup_date" ],
  disaggregate_by: ["owned_by_agency_id"],
  filters: [
    {
      "attribute": "status",
      "value": [
        "open"
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

Report.create_or_update(
  name_all: "Cases per Month",
  description_all: " Number of newly registered cases per month per location ",
  module_id:  PrimeroModule::CP,
  record_type: "case",
  aggregate_by: [ "owned_by_location" ],
  disaggregate_by: ["created_at"],
  filters: [{'attribute' => 'record_state', 'value' => ['true']}],
  group_ages: false,
  group_dates_by: "month",
  is_graph: true,
  editable: false,
)

Report.create_or_update({
  name_all: 'Cases with case plans',
  description_all: 'How many registered cases have case plans?',
  module_id: PrimeroModule::CP,
  record_type: 'case',
  aggregate_by: ['has_case_plan'],
  group_ages: false,
  group_dates_by: 'date',
  filters: default_case_filters,
  is_graph: false,
  editable: false
})
