class Dashboard < ValueObject
  attr_accessor :name, :type, :indicators

  # Note: The constant name of each Dashboard needs to match the value of the corresponding Permission

  CASE_OVERVIEW = Dashboard.new(
    name: 'case_overview',
    type: 'indicator',
    indicators: [
      Indicators::Case::OPEN, Indicators::Case::UPDATED,
      Indicators::Case::CLOSED_RECENTLY
    ]
  ).freeze

  WORKFLOW = Dashboard.new(
    name: 'workflow',
    type: 'indicator',
    indicators: [Indicators::Case::WORKFLOW]
  ).freeze

  WORKFLOW_TEAM = Dashboard.new(
    name: 'workflow_team',
    type: 'indicator',
    indicators: [Indicators::Case::WORKFLOW_TEAM]
  ).freeze

  CASE_RISK = Dashboard.new(
    name: 'case_risk',
    type: 'indicator',
    indicators: [Indicators::Case::RISK]
  ).freeze

  APPROVALS_ASSESSMENT = Dashboard.new(
    name: 'approvals_assessment',
    type: 'indicator',
    indicators: [
      Indicators::Case::APPROVALS_ASSESSMENT_PENDING,
      Indicators::Case::APPROVALS_ASSESSMENT_REJECTED,
      Indicators::Case::APPROVALS_ASSESSMENT_APPROVED
    ]
  ).freeze

  APPROVALS_CASE_PLAN = Dashboard.new(
    name: 'approvals_case_plan',
    type: 'indicator',
    indicators: [
      Indicators::Case::APPROVALS_CASE_PLAN_PENDING,
      Indicators::Case::APPROVALS_CASE_PLAN_REJECTED,
      Indicators::Case::APPROVALS_CASE_PLAN_APPROVED
    ]
  ).freeze

  APPROVALS_CLOSURE = Dashboard.new(
    name: 'approvals_closure',
    type: 'indicator',
    indicators: [
      Indicators::Case::APPROVALS_CLOSURE_PENDING,
      Indicators::Case::APPROVALS_CLOSURE_REJECTED,
      Indicators::Case::APPROVALS_CLOSURE_APPROVED
    ]
  ).freeze

  APPROVALS_ASSESSMENT_PENDING = Dashboard.new(
    name: 'approvals_assessment_pending',
    type: 'indicator',
    indicators: [Indicators::Case::APPROVALS_ASSESSMENT_PENDING_GROUP]
  ).freeze

  APPROVALS_CASE_PLAN_PENDING = Dashboard.new(
    name: 'approvals_case_plan_pending',
    type: 'indicator',
    indicators: [Indicators::Case::APPROVALS_CASE_PLAN_PENDING_GROUP]
  ).freeze

  APPROVALS_CLOSURE_PENDING = Dashboard.new(
    name: 'approvals_closure_pending',
    type: 'indicator',
    indicators: [Indicators::Case::APPROVALS_CLOSURE_PENDING_GROUP]
  ).freeze

  CASES_BY_TASK_OVERDUE_ASSESSMENT = Dashboard.new(
    name: 'cases_by_task_overdue_assessment',
    type: 'indicator',
    indicators: [Indicators::Case::TASKS_OVERDUE_ASSESSMENT]
  ).freeze

  CASES_BY_TASK_OVERDUE_CASE_PLAN = Dashboard.new(
    name: 'cases_by_task_overdue_case_plan',
    type: 'indicator',
    indicators: [Indicators::Case::TASKS_OVERDUE_CASE_PLAN]
  ).freeze

  CASES_BY_TASK_OVERDUE_SERVICES = Dashboard.new(
    name: 'cases_by_task_overdue_services',
    type: 'indicator',
    indicators: [Indicators::Case::TASKS_OVERDUE_SERVICES]
  ).freeze

  CASES_BY_TASK_OVERDUE_FOLLOWUPS = Dashboard.new(
    name: 'cases_by_task_overdue_followups',
    type: 'indicator',
    indicators: [Indicators::Case::TASKS_OVERDUE_FOLLOWUPS]
  ).freeze


end